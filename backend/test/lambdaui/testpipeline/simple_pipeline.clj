(ns lambdaui.testpipeline.simple-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.steps.support :refer [capture-output]]))



(def repo "https://github.com/flosell/testrepo.git")

(defonce lastStatus (atom nil))

(defn swapStatus [lastStatus]
  (case lastStatus
    :success :failure
    :failure :waiting
    :waiting :success
    :success))


(defn spy [x]
  (println x)
  x)

(defn successfullStep [args ctx]
  {:status :success :out "Wohoo!"})

(defn a-lot-output [args context]
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; done"))



(defn long-running-task-20s [args context]
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; echo \"Outputline ${i}\"; echo \"Outputline ${i}\"; echo \"Outputline ${i}\"; sleep 0.1s; done; echo \"..done \""))


(defn different-status [_ _]
  {:status (swap! lastStatus swapStatus)})

(def pipeline-structure
  `(a-lot-output
     (step/alias "i have substeps"
                 (run successfullStep
                      successfullStep
                      (step/alias "i have more substeps"
                                  a-lot-output)
                      a-lot-output))

     (step/alias "i have substeps"
                      (run (step/alias "2-parallel-step" (in-parallel a-lot-output a-lot-output))
                           (step/alias "2-parallel-step" (in-parallel a-lot-output a-lot-output))
                           (step/alias "i have more substeps"
                                       (run a-lot-output
                                            different-status))
                           a-lot-output))

     (step/alias "2-parallel-step" (in-parallel a-lot-output a-lot-output))
     (step/alias "3-parallel-steps" (in-parallel
                                      (step/alias "double-long" (run long-running-task-20s long-running-task-20s))
                                      long-running-task-20s
                                      long-running-task-20s
                                      long-running-task-20s))))
