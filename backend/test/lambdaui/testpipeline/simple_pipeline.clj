(ns lambdaui.testpipeline.simple-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.stepsupport.output :refer [capture-output]]
            [lambdacd.stepsupport.output :as output]))



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
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Ansi \u001B[45m\u001B[1mcolored\u001B[0m output \u001B[31mline \u001B[1m\u001B[32m${i}\"; done"))


(defn long-running [_ ctx]
  (let [p  (output/new-printer)]
    (output/print-to-output ctx p "Waiting for 20 seconds before step finishes..."))

  (Thread/sleep (* 20 1000))
  {:status :success})

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

     long-running

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

(defn  small-step [args context]
  (shell/bash context (:cwd args) "echo 'Moinsen!'"))

(defn wait-20-seconds [args context]
  (Thread/sleep (* 20 1000))
  {:status :success}
  )

(def first-step
  (either wait-for-manual-trigger wait-20-seconds)
  )


(def small-pipeline
  `(^{:display-type :step} (either wait-for-manual-trigger wait-20-seconds) small-step)
  )
