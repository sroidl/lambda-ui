(ns lambdaui.api
  (:require [org.httpkit.server :refer [with-channel on-close on-receive send! close]]
            [compojure.core :refer [routes GET POST defroutes context]]
            [ring.util.response :refer [response header]]
            [lambdacd.presentation.unified]
            [lambdacd.event-bus :as event-bus]
            [clojure.core.async :as async]
            [clojure.data.json :as json]
            [clojure.string :as s]
            [lambdacd.util]
            [org.httpkit.timer :as timer]
            [lambdacd.internal.pipeline-state :as state])
  (:import (org.joda.time DateTime)))



(defn extract-state
  "If one step is waiting, return waiting
   If one step is running, return running
   If last step failed, return failed
   If all steps are successful, return success"
  [build-steps]
  (let [aggregated-state (cond
                           (some #(= :waiting (:status %)) (vals build-steps)) :waiting
                           (some #(= :running (:status %)) (vals build-steps)) :running
                           (= :failure (:status (last (vals build-steps)))) :failed
                           :default (:status (first (vals build-steps))))]
    (case aggregated-state
      :failure :failed
      aggregated-state))
  )

(defn extract-start-time [build-steps]
  (when-let [^DateTime joda-start-time (:first-updated-at (first (vals build-steps)))]
    (str joda-start-time)))

(defn extract-end-time [build-steps]
  (let [all-times (map :most-recent-update-at (vals build-steps))]
    (when-let [joda-end-time (last (sort all-times))]
      (str joda-end-time))))

(defn summaries [pipeline-state]
  {:summaries
   (map (fn [[build-number build-steps]] {:buildNumber build-number
                                          :buildId     build-number
                                          :state       (extract-state build-steps)
                                          :startTime   (extract-start-time build-steps)
                                          :endTime     (extract-end-time build-steps)
                                          })
        pipeline-state)})

(defonce state-debug (atom nil))

(defn state-from-pipeline [pipeline]
   (state/get-all (:pipeline-state-component (:context pipeline))))

(defn- cross-origin-response [data]
  (header (response data) "Access-Control-Allow-Origin" "*")
  )

(defn summaries-response [pipeline]
  (cross-origin-response (summaries (state-from-pipeline pipeline))))


(defn- to-iso-string [timestamp]
  (when timestamp
    (str timestamp)))

(defn- finished? [status]
  (contains? #{:success :failure :killed} status))

(defn- step-id-str [step-id]
  (clojure.string/join "-" step-id))

(defn to-output-format [step]
  (let [status   (:status (:result step))
        base     {:stepId    (step-id-str (:step-id step))
                  :name      (:name step)
                  :state     (or status :pending)
                  :startTime (to-iso-string (:first-updated-at (:result step)))
                  :endTime   (when (finished? status) (to-iso-string (:most-recent-update-at (:result step))))}
        type (if (:type step) (:type step) "normal")
        base-with-type (assoc base :type type)
        children (:children step)]
    (if (and children
             (not (empty? children)))
      (assoc base-with-type :steps (map to-output-format (:children step)))
      base)))


(defn build-details-from-pipeline [pipeline-def pipeline-state build-id]
  {:buildId build-id
   :steps   (->> (lambdacd.presentation.unified/unified-presentation pipeline-def pipeline-state)
                 (map to-output-format))})

(defn- build-details-response [pipeline build-id]
  (let [build-state  (get (state-from-pipeline pipeline) (Integer/parseInt build-id))
        pipeline-def (:pipeline-def pipeline)]
    (build-details-from-pipeline pipeline-def build-state build-id)))

(defn only-matching-step [event-updates-ch build-id step-id]
  (let [result     (async/chan)
        transducer (comp
                     (filter #(= build-id (:build-number %)))
                     (filter #(= step-id (step-id-str (:step-id %))))
                     (map (fn [x] {:stepId (step-id-str (:step-id x))
                                   :buildId (:build-number x)
                                   :stepResult (:step-result x)})))]

    (async/pipeline 1 result transducer event-updates-ch)
    result))

(defn- to-step-id [step-id-s]
  (map #(Integer/parseInt %) (s/split step-id-s #"-")))



(defn finished-step? [pipeline build-id step-id]
   (finished? (:status
                       (-> (state-from-pipeline pipeline)
                           (get build-id)
                           (get (to-step-id step-id))
                           )))
  )

(defn output-events [pipeline ws-ch build-id step-id]
  (let [ctx            (:context pipeline)
        subscription   (event-bus/subscribe ctx :step-result-updated)
        payloads       (event-bus/only-payload subscription)
        filtered       (only-matching-step payloads build-id step-id)
        sliding-window (async/pipe filtered (async/chan (async/sliding-buffer 1)))
        ]
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
      (close ws-ch)
      )))

(defn- output-buildstep-websocket [pipeline req build-id step-id]
  (with-channel req ws-ch
                (output-events pipeline ws-ch (Integer/parseInt build-id) step-id)))

(defn- subscribe-to-summary-update [request pipeline]
  (with-channel request websocket-channel

                (let [ctx          (:context pipeline)
                      ;subscription (event-bus/subscribe ctx :step-result-updated)
                      ;payloads     (event-bus/only-payload subscription)
                      ]

                  (send! websocket-channel (lambdacd.util/to-json (summaries (state-from-pipeline pipeline))))
                  (close websocket-channel)

                  ;(async/go-loop []
                  ;  (if-let [event (async/<! payloads)]
                  ;    (do
                  ;      (println @current-count " -- " event)
                  ;      (send! websocket-channel (lambdacd.util/to-json (merge {:updateNo @current-count} (summaries (state-from-pipeline pipeline)))))
                  ;      (swap! current-count inc)
                  ;      (recur))))
                )))

(defn websocket-connection-for-details [pipeline build-id websocket-channel]
  (send! websocket-channel (json/write-str (build-details-response pipeline build-id)))
  (close websocket-channel))

(defn wrap-websocket [request handler]
                (with-channel request channel
                              (handler channel)))

(defn api-routes [pipeline]
  (routes
    (GET "/builds" [:as request] (subscribe-to-summary-update request pipeline))
    (GET "/builds/:build-id" [build-id :as request] (wrap-websocket request (partial websocket-connection-for-details pipeline build-id)))
    (GET "/builds/:build-id/:step-id" [build-id step-id :as request] (output-buildstep-websocket pipeline request build-id step-id))))
