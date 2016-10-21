(ns lambdaui.core
  (:require
    [compojure.core :refer [routes GET context POST]]
    [lambdaui.api :as new-api]
    [lambdacd-git.core :as git]
    [lambdacd.core :as lambdacd]
    [lambdaui.simple-pipeline :as pipe]
    [lambdacd.runners :as runners]
    [org.httpkit.server :as http]
    [ring.middleware.json :as ring-json]
    [lambdacd.ui.api :as old-api]
    [lambdacd.ui.ui-page :as old-ui]
    [lambdacd.steps.manualtrigger :as manualtrigger]
    [compojure.route :as route])
  (:gen-class)
  )


(defn get-trigger-id [pipeline]
  (((val (last (lambdacd.internal.pipeline-state/get-all (get-in pipeline [:context :pipeline-state-component])))) '(1 1)) :trigger-id)
  )

(defn trigger-new [pipeline]
  (let [ctx (:context pipeline)]
    (manualtrigger/post-id ctx (get-trigger-id pipeline) {})))

(defn try-parse-int [port default-fn]
  (try (Integer/parseInt port) (catch NumberFormatException e (default-fn e))))

(defonce server (atom nil))

(defn create-config [pipeline]
  "window.lambdaui = window.lambdaui || {};
  window.lambdaui.config = {
                            name: 'Pipeline config from server',
                            baseUrl: window.location.host
                            };"
  )

(defn pipeline-routes [pipeline]
  (ring-json/wrap-json-response
    (routes (context "/lambdaui/api" [] (new-api/api-routes pipeline))
            (POST "/lambdaui/api/triggerNew" [] (do (trigger-new pipeline) {}))
            (context "/api" [] (old-api/rest-api pipeline))
            (GET "/old" [] (old-ui/ui-page pipeline))
            (route/resources "/" {:root "public"})
            (GET "/" [] (ring.util.response/redirect "/ui/index.html"))
            (GET "/ui/config.js" [] (create-config pipeline))
            (route/resources "/ui" {:root "public/target"})
            )))

(defn start-server [port]
  (git/init-ssh!)
  (let [pipeline (lambdacd/assemble-pipeline pipe/pipeline-structure {:home-dir "tmp/foo"})]
    (runners/start-one-run-after-another pipeline)
    (reset! server (http/run-server (pipeline-routes pipeline) {:port port}))))

(defn -main [& [portArg]]
  (let [port (try-parse-int portArg (fn [_] (when portArg (println "Port '" portArg "' is not a number. Using default port")) 8081))]
    (println "Started Server on port " port ". CTRL+C to abort.")
    (start-server port)))

