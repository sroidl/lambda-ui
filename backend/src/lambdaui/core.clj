(ns lambdaui.core
  (:require [compojure.route :as route]
            [compojure.core :refer [routes GET context]]
            [lambdacd.ui.api :as api]
            [lambdaui.api :as new-api])
  (:gen-class)
  )

(defn ui-for
  ([pipeline]
   (routes
     (context "/api" [] (api/rest-api pipeline))
     (route/resources "/" {:root "public"})
     ;(GET "/" [] (ui-page/ui-page pipeline))
     )))

(defn try-parse-int [port default-fn]
  (try (Integer/parseInt port) (catch NumberFormatException e (default-fn e))))

(defn -main [& [portArg]]
  (let [port (try-parse-int portArg (fn [e] (when portArg (println "Port '" portArg "' is not a number. Using default port")) 80))]

    (println "Started Server on port " port ". CTRL+C to abort.")
    (new-api/start-server port))
  )