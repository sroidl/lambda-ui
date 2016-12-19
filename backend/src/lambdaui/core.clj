(ns lambdaui.core
  (:require
    [compojure.core :refer [routes GET context POST]]
    [lambdaui.api-legacy :as new-api]
    [ring.middleware.json :as ring-json]
    [ring.middleware.params :refer [wrap-params]]
    [lambdacd.ui.api :as old-api]
    [lambdacd.ui.ui-page :as old-ui]
    [compojure.route :as route]
    [clojure.tools.logging :as logger]
    [lambdaui.trigger :as runner]
    [lambdaui.polling :as polling]
    [lambdaui.config :refer [create-config-legacy]]

    )
  (:gen-class)
  )



; TODO -- support abritrary


(defn pipeline-routes [pipeline & {:keys [include-old-ui show-new-build-button] :or {include-old-ui true
                                                                                     show-new-build-button false}}]
  (ring-json/wrap-json-response
    (wrap-params
      (routes
        (route/resources "/lambdaui" {:root "public"})
        (route/resources "/" {:root "public"})
        (GET "/lambdaui" [] (ring.util.response/redirect "lambdaui/index.html"))
        (GET "/lambdaui/config.js" [] (create-config-legacy pipeline :show-new-build-button show-new-build-button))
        (context "/lambdaui/api" [] (new-api/api-routes pipeline))
        (POST "/lambdaui/api/triggerNew" request (do (runner/trigger-new-build pipeline request) {}))
        (when include-old-ui
          (GET "/" [] (old-ui/ui-page pipeline)))
        (context "/polling" [] (polling/polling-routes pipeline))

        (context "/api" []
          (old-api/rest-api pipeline)
          )))))

(defn ui-for [pipeline & opts]
  (pipeline-routes pipeline opts))

