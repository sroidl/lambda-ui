(ns lambdaui.api
  (:require [org.httpkit.server :refer [with-channel on-close on-receive send!]]
            [compojure.core :refer [routes GET POST defroutes context]]
            [ring.util.response :refer [response header]]
            [lambdacd.presentation.unified]
            [lambdacd.event-bus :as event-bus]
            [clojure.core.async :as async]
            [clojure.data.json :as json]
            [clojure.string :as s]
            [lambdacd.util]
            [lambdacd.internal.pipeline-state :as state])
  (:import (org.joda.time DateTime)))

(defn extract-state
  "If one step is waiting, return waiting
   If one step is running, return running
   If last step failed, return failed
   If all steps are successful, return success"
  [build-steps]
  (cond
    (some #(= :waiting (:status %)) (vals build-steps)) :waiting
    (some #(= :running (:status %)) (vals build-steps)) :running
    (= :failure (:status (last (vals build-steps)))) :failed
    :default (:status (first (vals build-steps)))))

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

(defn- is-finished [status]
  (contains? #{:success :failure :killed} status))

(defn- step-id-str [step-id]
  (clojure.string/join "-" step-id))

(defn to-output-format [step]
  (let [status   (:status (:result step))
        base     {:stepId    (step-id-str (:step-id step))
                  :name      (:name step)
                  :state     (or status :pending)
                  :startTime (to-iso-string (:first-updated-at (:result step)))
                  :endTime   (when (is-finished status) (to-iso-string (:most-recent-update-at (:result step))))}
        children (:children step)]
    (if (and children
             (not (empty? children)))
      (assoc base :steps (map to-output-format (:children step)))
      base)))


(defn build-details-from-pipeline [pipeline-def pipeline-state build-id]
  {:buildId build-id
   :steps   (->> (lambdacd.presentation.unified/unified-presentation pipeline-def pipeline-state)
                 (map to-output-format))})

(defn- build-details-response [pipeline build-id]
  (let [build-state  (get (state-from-pipeline pipeline) (Integer/parseInt build-id))
        pipeline-def (:pipeline-def pipeline)]
    (cross-origin-response
      (build-details-from-pipeline pipeline-def build-state build-id))))

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

(defn debug [x]
  (println x)
  x)

(defn build-step-events-to-ws [pipeline ws-ch build-id step-id]
  (let [ctx        (:context pipeline)
        subscription (event-bus/subscribe ctx :step-result-updated)
        payloads     (event-bus/only-payload subscription)
        filtered     (only-matching-step payloads build-id step-id)]
    (on-close ws-ch (fn [_] (event-bus/unsubscribe ctx :step-result-updated subscription)))
    (println "initializing" build-id step-id)
    (send! ws-ch (lambdacd.util/to-json {:stepResult (-> (state-from-pipeline pipeline)
                                                   (get build-id)
                                                   (get (to-step-id step-id)))
                                         :buildId build-id
                                         :stepId step-id}))
    (async/go-loop []
      (if-let [event (async/<! filtered)]
        (do
          (println "oh hai" event)
          (send! ws-ch (json/write-str event))
          (recur))))))

(defn- subscribe-to-step-result-update [pipeline req build-id step-id]
  (with-channel req ws-ch
                (build-step-events-to-ws pipeline ws-ch (Integer/parseInt build-id) step-id)))

(defn api-routes [pipeline]
  (routes
    (GET "/summaries" [] (summaries-response pipeline))
    (GET "/builds/:build-id" [build-id] (build-details-response pipeline build-id))
    (GET "/builds/:build-id/:step-id" [build-id step-id :as req] (subscribe-to-step-result-update pipeline req build-id step-id))))
