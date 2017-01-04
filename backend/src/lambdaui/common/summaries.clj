(ns lambdaui.common.summaries
  (:require [lambdacd.presentation.pipeline-state :as presentation]))


; ------ Summaries ------
(defn extract-state
  "If one step is waiting, return waiting
   If one step is running, return running
   If last step failed, return failed
   If all steps are successful, return success"
  [build-steps]
  (let [failure-mapper (fn [state] (if (= :failure state) :failed state))]
    (failure-mapper (presentation/overall-build-status build-steps))))

(defn extract-start-time [build-steps]
  (let [all-times (map :first-updated-at (vals build-steps))]
    (when-let [joda-end-time (first (sort all-times))]
      (str joda-end-time))))

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
                                          :endTime     (extract-end-time build-steps)})

        pipeline-state)})


{:step1 {:most-recent-update-at 123
         :first-updated-at      12321}}