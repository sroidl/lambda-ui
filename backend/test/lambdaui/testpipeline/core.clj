(ns lambdaui.testpipeline.core
  (:require [lambdacd-git.core :as git]
            [lambdacd.core :as lambdacd]
            [lambdacd.runners :as runners]
            [org.httpkit.server :as http]
            [lambdaui.simple-pipeline :as pipe]
            [lambdaui.core :as ui]))

(defonce server (atom nil))

(defn try-parse-int [port default-fn]
  (try (Integer/parseInt port) (catch NumberFormatException e (default-fn e))))

(defn start-server [port]
  (git/init-ssh!)
  (let [pipeline (lambdacd/assemble-pipeline pipe/pipeline-structure {:home-dir "/tmp/foo"})]
    (runners/start-one-run-after-another pipeline)
    (reset! server (http/run-server (ui/pipeline-routes pipeline) {:port port}))))

(defn -main [& [portArg]]
  (let [port (try-parse-int portArg (fn [_] (when portArg (println "Port '" portArg "' is not a number. Using default port")) 8081))]
    (println "Started Server on port " port ". CTRL+C to abort.")
    (start-server port)))