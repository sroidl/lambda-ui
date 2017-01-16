(ns lambdaui.api-legacy
  (:use [lambdaui.common.summaries])
  (:require [org.httpkit.server :refer [with-channel on-close on-receive send! close]]
            [compojure.core :refer [routes GET POST defroutes context]]
            [ring.util.response :refer [response header]]
            [lambdacd.presentation.unified]
            [lambdacd.event-bus :as event-bus]
            [clojure.core.async :as async]
            [clojure.data.json :as json]
            [clojure.string :as s]
            [lambdacd.util :as util]
            [lambdacd.core :as core]
            [lambdaui.common.common :refer [state-from-pipeline finished? step-id->str str->step-id]]
            [lambdaui.common.details :as details]
            [lambdaui.common.collections :refer [deep-merge]]))

(defn only-matching-step [event-updates-ch build-id step-id]
  (let [result (async/chan)
        transducer (comp
                     (filter #(= build-id (:build-number %)))
                     (filter #(= step-id (step-id->str (:step-id %))))
                     (map (fn [x] {:stepId     (step-id->str (:step-id x))
                                   :buildId    (:build-number x)
                                   :stepResult (:step-result x)})))]

    (async/pipeline 1 result transducer event-updates-ch)
    result))

(defn- to-step-id [step-id-s]
  (map #(Integer/parseInt %) (s/split step-id-s #"-")))



(defn finished-step? [pipeline build-id step-id]
  (finished? (:status
               (-> (state-from-pipeline pipeline)
                   (get build-id)
                   (get (to-step-id step-id))))))



(defn output-events [pipeline ws-ch build-id step-id]
  (let [ctx (:context pipeline)
        subscription (event-bus/subscribe ctx :step-result-updated)
        payloads (event-bus/only-payload subscription)
        filtered (only-matching-step payloads build-id step-id)
        sliding-window (async/pipe filtered (async/chan (async/sliding-buffer 1)))]

    (on-close ws-ch (fn [_] (do (event-bus/unsubscribe ctx :step-result-updated subscription) (println "closed channel!"))))
    (send! ws-ch (lambdacd.util/to-json {:stepResult (-> (state-from-pipeline pipeline)
                                                         (get build-id)
                                                         (get (to-step-id step-id)))
                                         :buildId    build-id
                                         :stepId     step-id}))

    (if (not (finished-step? pipeline build-id step-id))
      (async/thread []
                    (let [event (async/<!! sliding-window)]
                      (send! ws-ch (json/write-str event))
                      (async/<!! (async/timeout 1000))
                      (if (finished? (get-in event [:stepResult :status]))
                        (close ws-ch)
                        (recur))))
      (close ws-ch))))


(defn- output-buildstep-websocket [pipeline req build-id step-id]
  (with-channel req ws-ch
                (output-events pipeline ws-ch (Integer/parseInt build-id) step-id)))

(defn- subscribe-to-summary-update [request pipeline]
  (with-channel request websocket-channel

                (let [ctx (:context pipeline)]
                      ;subscription (event-bus/subscribe ctx :step-result-updated)
                      ;payloads     (event-bus/only-payload subscription)


                  (send! websocket-channel (lambdacd.util/to-json (summaries (state-from-pipeline pipeline))))
                  (close websocket-channel))))

                  ;(async/go-loop []
                  ;  (if-let [event (async/<! payloads)]
                  ;    (do
                  ;      (println @current-count " -- " event)
                  ;      (send! websocket-channel (lambdacd.util/to-json (merge {:updateNo @current-count} (summaries (state-from-pipeline pipeline)))))
                  ;      (swap! current-count inc)
                  ;      (recur))))


(defn websocket-connection-for-details [pipeline build-id websocket-channel]
  (send! websocket-channel (json/write-str (details/build-details-response pipeline build-id)))
  (close websocket-channel))

(defn wrap-websocket [request handler]
  (with-channel request channel
                (handler channel)))

(def killed-steps (atom #{}))

(defn kill-step [build-id step-id ctx]
  (let [identifier (str build-id "/" step-id)]
    (if-not (contains? @killed-steps identifier)
      (do
        (println "Kill Step " build-id " - " step-id)
        (swap! killed-steps (fn [old-value] (conj old-value identifier)))
        (core/kill-step ctx (util/parse-int build-id) (str->step-id step-id))
        {:status 200})
      (do (println "Already killed step " identifier) {:status 403} ))))



(defn api-routes [pipeline]
  (let [{pipeline-def :pipeline-def ctx :context} pipeline]
    (routes
      (GET "/builds" [:as request] (subscribe-to-summary-update request pipeline))
      (GET "/builds/:build-id" [build-id :as request] (wrap-websocket request (partial websocket-connection-for-details pipeline build-id)))
      (GET "/builds/:build-id/:step-id" [build-id step-id :as request] (output-buildstep-websocket pipeline request build-id step-id))
      (POST "/builds/:buildnumber/:step-id/retrigger" [buildnumber step-id]
        (let [new-buildnumber (core/retrigger pipeline-def ctx (util/parse-int buildnumber) (str->step-id step-id))]
          (util/json {:build-number new-buildnumber})))
      (POST "/builds/:buildnumber/:step-id/kill" [buildnumber step-id] (kill-step buildnumber step-id ctx)))))


