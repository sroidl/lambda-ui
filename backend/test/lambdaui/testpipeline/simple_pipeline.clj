(ns lambdaui.testpipeline.simple-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.steps.support :refer [capture-output]]

            ))

(def repo "https://github.com/flosell/testrepo.git")

(defonce lastStatus (atom nil))

(defn swapStatus [lastStatus]
  (case lastStatus
    :success :failure
    :failure :waiting
    :waiting :success
    :success)
  )

(defn spy [x]
  (println x)
  x)

(defn successfullStep [args ctx]
  {:status :success :out "Wohoo!"})

(defn a-lot-output [args context]
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; done")
  )


(defn long-running-task-20s [args context]
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; sleep 0.1s; done")
  )

(defn different-status [_ _]
  {:status (swap! lastStatus swapStatus)})

(def pipeline-structure
  `( wait-for-manual-trigger
     a-lot-output
     (step/alias "i have substeps"
            (run successfullStep
                 successfullStep
                 (step/alias "i have more substeps"
                        (run a-lot-output
                             different-status))
                 a-lot-output)
            )
     long-running-task-20s
     ))
