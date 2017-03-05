(ns lambdaui.testpipeline.core
  (:require [lambdacd-git.core :as git]
            [lambdacd.core :as lambdacd]
            [lambdacd.util :as util]
            [lambdacd.runners :as runners]
            [org.httpkit.server :as http]
            [lambdaui.testpipeline.simple-pipeline :as pipe]
            [lambdaui.testpipeline.trigger-pipeline :as pipe-with-trigger]
            [lambdaui.testpipeline.long-running :as long-running-pipe]
            [lambdaui.testpipeline.artifact-pipeline :as artifact-pipeline]
            [lambdaui.core :as ui]
            [clojure.core.async :as async :refer [go <! <!! >! >!!]]
            [lambdacd.event-bus :as events]
            [lambdacd.event-bus :as event-bus]
            [lambdaui.fixtures.pipelines :as fixture]
            [compojure.core :refer [routes GET context POST]]
            [ring.middleware.cors :refer [wrap-cors]]
            [lambdacd.presentation.unified :as presentation]
            [lambdacd-artifacts.core :as artifacts])

  (:use [lambdacd.runners]))

(defonce server (atom nil))

(defonce current-pipeline (atom nil))

(defn try-parse-int [port default-fn]
  (try (Integer/parseInt port) (catch NumberFormatException e (default-fn e))))


(def ui-config {:navbar {:links [{:url "http://localhost:8080/" :text "Link without target" :target ""}]}})

(def artifacts-path-context "/artifacts")

(defn start-server [port]
  (let [small-pipeline (lambdacd/assemble-pipeline pipe/small-pipeline {:home-dir (util/create-temp-dir) :name "SMALL_PIPELINE"})
        simple-pipeline (lambdacd/assemble-pipeline pipe/pipeline-structure {:home-dir (util/create-temp-dir) :name "SIMPLE PIPELINE" :ui-config ui-config})
        trigger-pipeline (lambdacd/assemble-pipeline pipe-with-trigger/pipeline-structure {:home-dir (util/create-temp-dir) :name "TRIGGER PIPELINE"})
        long-running-pipeline (lambdacd/assemble-pipeline long-running-pipe/pipeline-structure {:home-dir (util/create-temp-dir) :name "LONG-RUNNING PIPELINE"})
        artifact-pipeline (lambdacd/assemble-pipeline artifact-pipeline/pipeline-structure {:home-dir "/tmp/moinsen" :artifacts-path-context artifacts-path-context :name "ARTIFACT PIPELINE"})]

    (reset! current-pipeline simple-pipeline)

    (reset! server

            (let [routes

                  (routes
                    (ui/ui-for simple-pipeline :showStartBuildButton true)
                    (context artifacts-path-context [] (artifacts/artifact-handler-for artifact-pipeline))

                    (context "/long-running" []
                      (ui/ui-for long-running-pipeline :showStartBuildButton true :contextPath "/long-running"))

                    (context "/trigger-pipeline" []
                      (ui/ui-for trigger-pipeline :showStartBuildButton true :contextPath "/trigger-pipeline")))]


              (http/run-server
                (wrap-cors routes :access-control-allow-origin [#".*"]
                           :access-control-allow-methods [:get :put :post :delete])

                {:port port})))))


(defn -main [& [portArg]]
  (let [port (try-parse-int portArg (fn [_] (when portArg (println "Port '" portArg "' is not a number. Using default port")) 8081))]
    (println "Started Server on port " port ". CTRL+C to abort.")
    (start-server port)))

(defn stop []
  (when @server (@server)))

(defn start []
  (stop)
  (-main))

(let [pipeline-def (:pipeline-def @current-pipeline)
      pipeline-state (:pipeline-state-component (:context @current-pipeline))]
  (presentation/unified-presentation pipeline-def pipeline-state))
