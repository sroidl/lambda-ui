(ns lambdaui.trigger
  (:require [clojure.core.async :as async]
            [lambdacd.internal.execution :as execution]))


(defn trigger-new-build [{pipeline-def :pipeline-def context :context}]
  (async/thread
    (println "Starting new build")
    (execution/run pipeline-def context)
    ))