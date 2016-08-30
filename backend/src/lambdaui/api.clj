(ns lambdaui.api
  (:require [org.httpkit.server :as http :refer [with-channel on-close on-receive send!]]
            [compojure.core :refer [routes GET POST defroutes]]
            [lambdaui.dummy-data :as frontend-dummy]
            [ring.middleware.json :as ring-json]
            [compojure.route :as route])
  )


;spike websocket -- example code.
;(defonce c (atom nil))
;(defn websocket [req]
;  (reset! c (with-channel req channel
;                          (on-close channel (fn [status] (println "channel closed: " status)))
;                          (on-receive channel (fn [data]    ;; echo it back
;                                                (send! channel data)))))
;  )


(defn backend-for-frontend []
  (ring-json/wrap-json-response
    (routes (GET "/summaries" [] (frontend-dummy/build-summaries))
            (route/resources "/" {:root "public"})
            ))
  )


(defonce server (atom nil))

(defn start-server []
  (reset! server (http/run-server (backend-for-frontend) {:port 4444})))

