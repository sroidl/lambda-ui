(ns lambdaui.testpipeline.artifact-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.steps.support :as support]
            [lambdacd-artifacts.core :as artifacts]))

(defn write-a-file [{cwd :cwd} ctx]
  (shell/bash ctx cwd "echo 'test' > text.txt"))

(defn publish-artifacts [args ctx]
  (artifacts/publish-artifacts args ctx (:cwd args) ["text.txt"]))

(def pipeline-structure `((with-workspace write-a-file publish-artifacts)))