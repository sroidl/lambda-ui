(ns lambdaui.core
  (:require
    [compojure.core :refer [routes GET context POST]]
    [lambdaui.api :as new-api]
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

(defn extract-location [location]
  (if (= location :backend-location)
    "window.location.host"
    location))

(defn create-config [pipeline]
  (let [config (get-in pipeline [:context :config :ui-config])
        name (or (:name config) "Pipeline")
        location (or (extract-location (:location config))
                     "window.location")
        path-prefix  (:path-prefix config)

        prefix (if path-prefix (str " + '" path-prefix "'") "")
        location (str location prefix)
        ]

    (str "window.lambdaui = window.lambdaui || {}; "
         "window.lambdaui.config = { name: '" name "', baseUrl: " location "};"))
  )

(defn pipeline-routes [pipeline]
  (ring-json/wrap-json-response
    (routes (context "/lambdaui/api" [] (new-api/api-routes pipeline))
            (POST "/lambdaui/api/triggerNew" [] (do (trigger-new pipeline) {}))
            (context "/api" [] (old-api/rest-api pipeline))
            (GET "/old" [] (old-ui/ui-page pipeline))
            (route/resources "/" {:root "public"})
            (GET "/" [] (ring.util.response/redirect "ui/index.html"))
            (GET "/ui/config.js" [] (create-config pipeline))
            (route/resources "/ui" {:root "public/target"})
            )))


