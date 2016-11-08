(ns lambdaui.core
  (:require
    [compojure.core :refer [routes GET context POST]]
    [lambdaui.api :as new-api]
    [ring.middleware.json :as ring-json]
    [lambdacd.ui.api :as old-api]
    [lambdacd.ui.ui-page :as old-ui]
    [lambdacd.steps.manualtrigger :as manualtrigger]
    [compojure.route :as route]
    [clojure.tools.logging :as logger]
    [lambdaui.trigger :as runner]

    )
  (:gen-class)
  )


(defn get-trigger-id [pipeline]
  (((val (last (lambdacd.internal.pipeline-state/get-all (get-in pipeline [:context :pipeline-state-component])))) '(1 1)) :trigger-id)
  )

(defn extract-location [location]
  (when (not (= location :backend-location)) location))

(defn create-config [pipeline]
  (let [config (get-in pipeline [:context :config :ui-config])
        name (or (:name config) "Pipeline")
        location (or (extract-location (:location config))
                     "window.location.host")
        path-prefix  (:path-prefix config)

        prefix (if path-prefix (str " + '" path-prefix "'") "")
        location (str location prefix)
        ]

    (str "window.lambdaui = window.lambdaui || {}; "
         "window.lambdaui.config = { name: '" name "', baseUrl: " location "};"))
  )

(defn pipeline-routes [pipeline]
  (ring-json/wrap-json-response
    (routes
            (route/resources "/" {:root "public"})
            (GET "/" [] (ring.util.response/redirect "/index.html"))
            (GET "/config.js" [] (create-config pipeline))
            (context "/lambdaui/api" [] (new-api/api-routes pipeline))
            (POST "/lambdaui/api/triggerNew" [] (do (runner/trigger-new-build pipeline) {}))
            (context "/api" [] (old-api/rest-api pipeline))
            (GET "/old" [] (old-ui/ui-page pipeline))
            )))


