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

(defn extract-state [build-steps]
  (cond
    (some #(= :waiting (:status %)) (vals build-steps)) :waiting
    (some #(= :running (:status %)) (vals build-steps)) :running
    (= :failure (:status (last (vals build-steps)))) :failure
    :default (:status (first (vals build-steps)))))

(defn extract-start-time [build]
  )

(defn extract-end-time [build]
  )

(defn summaries [pipeline-state]
  {:summaries
   (map (fn [[build-number build]] {:buildNumber build-number
                                    :buildId     build-number
                                    :state       (extract-state build)
                                    :startTime   (extract-start-time build)
                                    :endTime     (extract-end-time build)
                                    })
        pipeline-state)})

(defn ui-for-pipeline [pipeline]
  (ring-json/wrap-json-response
    (routes (GET "/api/summaries" [] (frontend-dummy/build-summaries))
            (GET "/" [] (ring.util.response/redirect "/ui/index.html"))
            (route/resources "/ui" {:root "public/target"}))))

(defonce server (atom nil))

(defn start-server [port]
  (reset! server (http/run-server (ui-for-pipeline nil) {:port port})))
