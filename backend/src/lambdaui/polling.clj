(ns lambdaui.polling
  (:use [lambdaui.common.summaries])
  (:require [compojure.core :refer [routes GET]]
            [ring.util.response :refer [header response]]
            [ring.middleware.json :refer [wrap-json-response]]
            [lambdaui.json-util :as json-util]))

(defn- cross-origin-response [data]
  (header (response data) "Access-Control-Allow-Origin" "*"))

(defn summary-response [pipeline]
  (json-util/to-json (summaries (:context pipeline))))

(defn polling-routes [pipeline]
  (routes
    (GET "/builds" _ (cross-origin-response (summary-response pipeline)))
    ;(GET "/builds/:build-id" [build-id :as request] (wrap-websocket request (partial websocket-connection-for-details pipeline build-id)))
    ;(GET "/builds/:build-id/:step-id" [build-id step-id :as request] (output-buildstep-websocket pipeline request build-id step-id))
    ))


