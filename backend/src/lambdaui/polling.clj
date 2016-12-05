(ns lambdaui.polling
  (:require [compojure.core :refer [routes GET]]
            [ring.util.response :refer [response]]
            [ring.middleware.json])
  )





(defn api-routes [pipeline]
  (wrap-json-response
    (routes
      (GET "/builds" request (response (summary-response request pipeline)))
      (GET "/builds/:build-id" [build-id :as request] (wrap-websocket request (partial websocket-connection-for-details pipeline build-id)))
      (GET "/builds/:build-id/:step-id" [build-id step-id :as request] (output-buildstep-websocket pipeline request build-id step-id)))))

