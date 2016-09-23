(ns lambdaui.simple-pipeline
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

(defonce should-fail? (atom false))

(defn fail-every-other-run [_ _]
  (swap! should-fail? not)
  (if @should-fail?
    {:status :failure}
    {:status :success}))

(def pipeline-structure
  `((either
      wait-for-manual-trigger
      wait-for-git)
     (with-workspace
       clone
       git/list-changes
       ls)
     fail-every-other-run
     ))
