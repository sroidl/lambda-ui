(ns lambdaui.example.simple-pipeline
  (:use [compojure.core])
  (:require [lambdacd.steps.shell :as shell]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger]]
            [lambdacd.steps.control-flow :refer [either with-workspace in-parallel run] :as step]
            [lambdacd.core :as lambdacd]
            [org.httpkit.server :as server]
            [lambdacd.ui.api]
            [lambdacd.util :as file-util]
            [lambdaui.core :as ui]
            [lambdacd.steps.manualtrigger :refer [wait-for-manual-trigger parameterized-trigger]]
            [lambdacd.runners :as pipeline-runners]
            [lambdacd.steps.support :as support]))

(defonce lastStatus (atom nil))

(defn swapStatus [lastStatus]
  (case lastStatus
    :success :failure
    :failure :waiting
    :waiting :success
    :success))

(defn successfullStep [args ctx]
  {:status :success :out "Wohoo!"})

(defn a-lot-output [args context]
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; done"))


(defn long-running-task-20s [args context]
  (shell/bash context (:cwd args) "for i in {1..200}; do echo \"Outputline ${i}\"; sleep 0.1s; done"))

(defn different-status [_ _]
  {:status (swap! lastStatus swapStatus)})

(defn output-parameters [args ctx]
  (let [p (support/new-printer)
        out #(support/print-to-output ctx p %)
        revision (get args :revision)

        ]
    (out (str "result from previous step \n" (clojure.pprint/write args :stream nil)))

    (if revision (out (str "Revision entered: " revision))
                 (out "You did not use the parameterized trigger."))
    {:status :success}
    ))

(defn wait-for-git-revision [_ ctx]
  (let [result
        (parameterized-trigger {:revision {:desc "Input git revision"}} ctx)]

    (update result :global #(assoc % :revision (:revision result)))))



(def pipeline-structure
  `((step/alias "press \u25B6 to start build"
                (either
                  wait-for-manual-trigger
                  wait-for-git-revision
                  ))
     output-parameters
     output-parameters
     a-lot-output
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
      (println "No argument given. Fallback to default port " default)
      default)))

(defonce server (atom nil))

(defn -main [& args]
  (let [home-dir (file-util/create-temp-dir)
        config {:home-dir  home-dir
                :name      "Example Pipeline"
                :ui-config {
                            :navbar               {:links [{:text "Configure Link to github" :url "https://github.com/sroidl/lambda-ui"}]}
                            :showStartBuildButton false}

                }
        port (try-parse (System/getenv "PORT") 8082)
        pipeline (lambdacd/assemble-pipeline pipeline-structure config)]

    (pipeline-runners/start-one-run-after-another pipeline)
    (reset! server
            (server/run-server (routes

                                 (ui/pipeline-routes pipeline))
                               {:open-browser? false
                                :port          port}))))

(defn stop []
  (when-let [shutdown @server] (shutdown) (reset! server nil)))

(defn start []
  (stop)
  (-main))