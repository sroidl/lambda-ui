(ns lambdaui.core
  (:require [compojure.route :as route]
            [compojure.core :refer [routes GET context]]
            [lambdacd.ui.api :as api]
            [lambdaui.api :as new-api])
  )

(defn ui-for
  ([pipeline]
   (routes
     (context "/api" [] (api/rest-api pipeline))
     (route/resources "/" {:root "public"})
     ;(GET "/" [] (ui-page/ui-page pipeline))
     )))

(defn -main [& args]
  (println "Started backend-for-frontend. CTRL+C to abort.")
  (new-api/start-server)
  )