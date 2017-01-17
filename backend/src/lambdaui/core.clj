(ns lambdaui.core
  (:require
    [compojure.core :refer [routes GET context POST]]
    [lambdaui.api-legacy :as new-api]
    [ring.middleware.json :as ring-json]
    [ring.middleware.params :refer [wrap-params]]
    [lambdacd.ui.api :as old-api]
    [lambdacd.ui.ui-page :as old-ui]
    [compojure.route :as route]
    [lambdaui.trigger :as runner]
    [lambdaui.config :as config]
    [trptcolin.versioneer.core :as version])

  (:gen-class))

(defn pipeline-routes
  ([pipeline & {:keys [showStartBuildButton contextPath] }]

   (let [configuration (config/pipeline->config pipeline {:showStartBuildButton showStartBuildButton
                                                          :path-prefix          contextPath})

         show-version? (:show-version configuration)]

     (ring-json/wrap-json-response
       (wrap-params
         (routes
           (route/resources "/lambdaui" {:root "public"})
           (route/resources "/" {:root "public"})
           (GET "/lambdaui" [] (ring.util.response/redirect "lambdaui/index.html"))
           (GET "/lambdaui/config.js" [] (config/config_edn->config_js configuration))
           (context "/lambdaui/api" [] (new-api/api-routes pipeline))
           (POST "/lambdaui/api/triggerNew" request (do (runner/trigger-new-build pipeline request) {}))
           (GET "/" [] (old-ui/ui-page pipeline))
           (context "/api" []
             (old-api/rest-api pipeline))


           (GET "/lambdaui/version" [] (ring.util.response/response
                                         (if (true? show-version?)
                                           (str "Lambdaui-Version: " (version/get-version "lambdaui" "lambdaui"))
                                           (str "N/A")
                                           )))))))))


(defn ui-for [pipeline & opts]
  (apply pipeline-routes pipeline opts))
