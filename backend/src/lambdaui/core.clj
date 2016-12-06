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

    )
  (:gen-class)
  )

(defn extract-location [location]
  (when (not (= location :backend-location)) location))

(defn create-config [pipeline]
  (let [config (get-in pipeline [:context :config :ui-config])
        name (or (:name config) "Pipeline")
        location (or (extract-location (:location config))
                     "window.location.host")
        path-prefix (:path-prefix config)

        prefix (if path-prefix (str " + '" path-prefix "'") "")
        location (str location prefix)
        ]

    (str "window.lambdaui = window.lambdaui || {}; "
         "window.lambdaui.config = { name: '" name "', baseUrl: " location "};"))
  )

(defn pipeline-routes [pipeline]
  (ring-json/wrap-json-response
    (wrap-params
      (routes
        (route/resources "/lambdaui" {:root "public"})
        (route/resources "/" {:root "public"})
        (GET "/lambdaui" [] (ring.util.response/redirect "lambdaui/index.html"))
        (GET "/lambdaui/config.js" [] (create-config pipeline))
        (context "/lambdaui/api" [] (new-api/api-routes pipeline))
        (POST "/lambdaui/api/triggerNew" request (do (runner/trigger-new-build pipeline request) {}))
        (GET "/" [] (old-ui/ui-page pipeline))
        (context "/api" [] (old-api/rest-api pipeline))
        ))))


