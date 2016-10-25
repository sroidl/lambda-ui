(ns lambdaui.testpipeline.simple-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run]]
            [lambdacd-git.core :as git]))

(def repo "https://github.com/flosell/testrepo.git")

(defn wait-for-git [args ctx] `(git/wait-for-git ctx repo
                                                 :ref "refs/heads/master"
                                                 :ms-between-polls (* 60 1000)))

(defn clone [args ctx]
  (git/clone ctx repo (:revision args) (:cwd args)))

(defn ls [args ctx]
  (shell/bash ctx (:cwd args) "ls"))

(defonce lastStatus (atom nil))

(defn swapStatus [lastStatus]
  (case lastStatus
    :success :failure
    :failure :waiting
    :waiting :success
    :success)
  )


(defn long-running-task-10s [_ _]
  (Thread/sleep 10000)
  {:status :success}
  )

(defn different-status [_ _]
  {:status (swap! lastStatus swapStatus)})

(def pipeline-structure
  `((either
      wait-for-manual-trigger
      wait-for-git)
     (with-workspace
       clone
       git/list-changes
       ls)
     different-status
     long-running-task-10s
     ))
