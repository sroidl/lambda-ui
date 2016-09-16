(ns lambdaui.core
  (:require
    [compojure.core :refer [routes GET context]]
    [lambdaui.api :as new-api]
    [lambdacd-git.core :as git]
    [lambdacd.core :as lambdacd]
    [lambdaui.simple-pipeline :as pipe]
    [lambdacd.runners :as runners]
    [org.httpkit.server :as http]
    [ring.middleware.json :as ring-json]
    [lambdacd.ui.api :as old-api]
    [lambdacd.ui.ui-page :as old-ui]
    [compojure.route :as route])
  (:gen-class)
  )

(defn try-parse-int [port default-fn]
  (try (Integer/parseInt port) (catch NumberFormatException e (default-fn e))))

(defonce server (atom nil))

(defn pipeline-routes [pipeline]
  (ring-json/wrap-json-response
    (routes (context "/lambdaui/api" [] (new-api/api-routes pipeline))
            (context "/api" [] (old-api/rest-api pipeline))
            (GET "/old" [] (old-ui/ui-page pipeline))
            (route/resources "/" {:root "public"}))))

(defn start-server [port]
  (git/init-ssh!)
  (let [pipeline (lambdacd/assemble-pipeline pipe/pipeline-structure {:home-dir "tmp/foo"})]
    (runners/start-one-run-after-another pipeline)
    (reset! server (http/run-server (pipeline-routes pipeline) {:port port}))))

(defn -main [& [portArg]]
  (let [port (try-parse-int portArg (fn [] (when portArg (println "Port '" portArg "' is not a number. Using default port")) 8081))]
    (println "Started Server on port " port ". CTRL+C to abort.")
    (start-server port)))
