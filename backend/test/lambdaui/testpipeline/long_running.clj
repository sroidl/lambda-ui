(ns lambdaui.testpipeline.long-running
  (:use [compojure.core])
  (:require [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run]]
            [lambdacd.stepsupport.output :as output]))




(defn long-running-step [seconds]
  (fn [_ ctx]
    (let [printer (output/new-printer)
          append #(output/print-to-output ctx printer %)]
      (doseq [remaining (reverse (range 1 seconds))]
        (append (str remaining " seconds remaining.. "))
        (Thread/sleep 1000)))



    {:status :success}))

(def pipeline-structure `((long-running-step 40)(long-running-step 40)))
