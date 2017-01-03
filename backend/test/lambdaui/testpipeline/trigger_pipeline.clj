(ns lambdaui.testpipeline.trigger-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger] :as triggers]
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
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; echo \"Outputline ${i}\"; echo \"Outputline ${i}\"; echo \"Outputline ${i}\"; sleep 0.1s; done; echo \"..done \"")
  )

(defn different-status [_ _]
  {:status (swap! lastStatus swapStatus)})

(def step-ctx (atom nil))
(def step-args (atom nil))

(defn spy-step [args ctx]
  (reset! step-ctx ctx)
  (reset! step-args args)
  {:status :success}
  )

(defn git-revision-trigger [_ ctx]
  (triggers/parameterized-trigger {:revision {:desc "Please enter git revision to build"}
                                   :secondParam {:desc "Another paramater"}} ctx))

(def pipeline-structure
  `(
     (either wait-for-manual-trigger
             git-revision-trigger
             )
     a-lot-output
     (step/alias "i have substeps"
                 (run successfullStep
                      wait-for-manual-trigger
                      successfullStep
                      (step/alias "i have more substeps"
                                  (run a-lot-output
                                       different-status))
                      a-lot-output)
                 )
     (step/alias "i have substeps"
                      (run (step/alias "2-parallel-step" (in-parallel a-lot-output a-lot-output))
                           wait-for-manual-trigger
                           (step/alias "2-parallel-step" (in-parallel a-lot-output a-lot-output))
                           (step/alias "i have more substeps"
                                       (run a-lot-output
                                            different-status))
                           a-lot-output)
                      )
     (step/alias "2-parallel-step" (in-parallel a-lot-output a-lot-output))
     (step/alias "3-parallel-steps" (in-parallel
                                      (step/alias "double-long" (run long-running-task-20s long-running-task-20s))
                                      long-running-task-20s
                                      long-running-task-20s
                                      long-running-task-20s))))