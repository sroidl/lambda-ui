(ns lambdaui.core
  (:require [compojure.route :as route]
            [compojure.core :refer [routes GET context]]
            [lambdacd.ui.api :as api]))

(defn ui-for
  ([pipeline]
   (routes
     (context "/api" [] (api/rest-api pipeline))
     (route/resources "/" {:root "public"})
     ;(GET "/" [] (ui-page/ui-page pipeline))
     )))
