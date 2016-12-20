(ns lambdaui.testpipeline.core
  (:require [lambdacd-git.core :as git]
            [lambdacd.core :as lambdacd]
            [lambdacd.util :as util]
            [lambdacd.runners :as runners]
            [org.httpkit.server :as http]
            [lambdaui.testpipeline.simple-pipeline :as pipe]
            [lambdaui.testpipeline.trigger-pipeline :as pipe-with-trigger]
            [lambdaui.core :as ui]
            [lambdacd.internal.execution :as exec]
            [clojure.core.async :as async :refer [go <! <!! >! >!!]]
            [lambdacd.event-bus :as events]
            [lambdacd.event-bus :as event-bus]
            [lambdaui.fixtures.pipelines :as fixture]
            [compojure.core :refer [routes GET context POST]]
            )
  (:use [lambdacd.runners]))

(defonce server (atom nil))

(defonce current-pipeline (atom nil))

(defn try-parse-int [port default-fn]
  (try (Integer/parseInt port) (catch NumberFormatException e (default-fn e))))



(defn start-server [port]
  (let [pipeline (lambdacd/assemble-pipeline pipe-with-trigger/pipeline-structure {:home-dir (util/create-temp-dir) :ui-config {:name "TEST PIPELINE" :location :backend-location :path-prefix ""}})]
    (reset! current-pipeline pipeline)
    (reset! server (http/run-server
                     (routes
                       (ui/pipeline-routes pipeline)
                       #_(context "/prefix-test" []
                         (ui/pipeline-routes pipeline :contextPath "/prefix-test")))
                     {:port port}))))


(defn -main [& [portArg]]
  (let [port (try-parse-int portArg (fn [_] (when portArg (println "Port '" portArg "' is not a number. Using default port")) 8081))]
    (println "Started Server on port " port ". CTRL+C to abort.")
    (start-server port)))

(defn stop []
  (when @server (@server)))

(defn start []
  (stop)
  (-main))