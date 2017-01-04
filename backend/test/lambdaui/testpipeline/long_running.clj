(ns lambdaui.testpipeline.long-running
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.steps.support :as support]))




(defn long-running-step [seconds]
  (fn [_ ctx]
    (let [printer (support/new-printer)
          append #(support/print-to-output ctx printer %)]
      (doseq [remaining (reverse (range 1 seconds))]
        (append (str remaining " seconds remaining.. "))
        (Thread/sleep 1000)))



    {:status :success}))

(def pipeline-structure `((long-running-step 40)(long-running-step 40)))