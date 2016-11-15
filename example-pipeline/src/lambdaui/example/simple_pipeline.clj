(ns lambdaui.example.simple-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.core :as lambdacd]
            [org.httpkit.server :as server]
            [lambdacd.ui.api]
            [lambdacd.runners :as runners]
            [clojure.java.io :as io]
            [lambdaui.core :as ui]))

(defonce lastStatus (atom nil))

(defn swapStatus [lastStatus]
  (case lastStatus
    :success :failure
    :failure :waiting
    :waiting :success
    :success)
  )

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
  `( a-lot-output
     (step/alias "i have substeps"
                 (run successfullStep
                      successfullStep
                      (step/alias "i have more substeps"
                                  (run a-lot-output
                                       different-status))
                      a-lot-output)
                 )
     (in-parallel
       (step/alias "double-long" (run long-running-task-20s long-running-task-20s))
       long-running-task-20s
       long-running-task-20s
       )
     long-running-task-20s
     ))


(defn try-parse [input default]
  (if input
    (try
      (Integer/parseInt input) (catch RuntimeException e (doall (println "cannot parse int " input) default)))
    (do
      (println "No argument given. Fallback to default")
      default)
    ))

(defn -main [& args]
  (let [home-dir (io/file "/tmp/foo")
        config {:home-dir home-dir}
        port (try-parse (System/getenv "PORT") 8082)
        pipeline (lambdacd/assemble-pipeline pipeline-structure config)]
    (server/run-server (routes
                         (ui/pipeline-routes pipeline))
                       {:open-browser? false
                        :port          port})))
