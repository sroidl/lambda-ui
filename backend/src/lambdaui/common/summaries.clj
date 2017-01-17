(ns lambdaui.common.summaries
  (:require [lambdacd.presentation.pipeline-state :as presentation]
            [lambdaui.common.step-state :as steps]
            ))


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
  (let [
        all-but-triggers (filter #(not (steps/is-trigger? %)) (vals build-steps))
        all-times (map :first-updated-at all-but-triggers)]
    (when-let [joda-end-time (first (sort all-times))]
      (str joda-end-time))))

(defn extract-end-time [build-steps]
  (let [all-times (map :most-recent-update-at (vals build-steps))]
    (when-let [joda-end-time (last (sort all-times))]
      (str joda-end-time))))


(defn pipeline-state-entry->summaries-entry [build-number build-steps]
  {:buildNumber build-number
   :buildId     build-number
   :state       (extract-state build-steps)
   :startTime   (extract-start-time build-steps)
   :endTime     (extract-end-time build-steps)
   :duration    (presentation/build-duration build-steps)}
  )



(defn summaries [pipeline-state]
  {:summaries
   (map #(pipeline-state-entry->summaries-entry (first %) (last %)) pipeline-state)})


