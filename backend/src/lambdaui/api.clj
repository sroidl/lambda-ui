(ns lambdaui.api
  (:require [org.httpkit.server :refer [with-channel on-close on-receive send!]]
            [compojure.core :refer [routes GET POST defroutes context]]
            [ring.util.response :refer [response header]]
            [lambdacd.presentation.unified]
            [lambdacd.internal.pipeline-state :as state])
  (:import (org.joda.time DateTime)))

;spike websocket -- example code.
;(defonce c (atom nil))
;(defn websocket [req]
;  (reset! c (with-channel req channel
;                          (on-close channel (fn [status] (println "channel closed: " status)))
;                          (on-receive channel (fn [data]    ;; echo it back
;                                                (send! channel data)))))
;  )

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

(defn summaries-response [pipeline]
  (header (response (summaries (state-from-pipeline pipeline))) "Access-Control-Allow-Origin" "*"))

(defn api-routes [pipeline]
  (routes (GET "/summaries" [] (summaries-response pipeline))))


(defn map-step [step]
  (let [base {:stepId    (clojure.string/join "-" (:step-id step))
              :name      (:name step)
              :state     (:status (:result step))
              :startTime (str (:first-updated-at (:result step)))
              }
        children (:children step)
        ]
    (if (and children (not (empty? children))) (assoc base :steps (map map-step (:children step))) base)
    )
  )


(defn build-details-from-pipeline [pipeline-def pipeline-state buildId]

  {:buildId buildId
   :steps   (->> (lambdacd.presentation.unified/unified-presentation pipeline-def pipeline-state)
                 (map map-step)
                 )}
  )