(ns lambdaui.api
  (:require [org.httpkit.server :as http :refer [with-channel on-close on-receive send!]]
            [compojure.core :refer [routes GET POST defroutes]]
            [lambdaui.dummy-data :as frontend-dummy]
            [ring.middleware.json :as ring-json]
            [compojure.route :as route])
  (:import (org.joda.time DateTime)))


;spike websocket -- example code.
;(defonce c (atom nil))
;(defn websocket [req]
;  (reset! c (with-channel req channel
;                          (on-close channel (fn [status] (println "channel closed: " status)))
;                          (on-receive channel (fn [data]    ;; echo it back
;                                                (send! channel data)))))
;  )

(defn extract-state
  "If one step is waiting, return waiting
   If one step is running, return running
   If last step failed, return failed
   If all steps are successful, return success"
  [build-steps]
  (cond
    (some #(= :waiting (:status %)) (vals build-steps)) :waiting
    (some #(= :running (:status %)) (vals build-steps)) :running
    (= :failure (:status (last (vals build-steps)))) :failure
    :default (:status (first (vals build-steps)))))

(defn extract-start-time [build-steps]
  (when-let [^DateTime joda-start-time (:first-updated-at (first (vals build-steps)))]
    (str joda-start-time)))

(defn extract-end-time [build]
  )

(defn summaries [pipeline-state]
  {:summaries
   (map (fn [[build-number build-steps]] {:buildNumber build-number
                                    :buildId           build-number
                                          :state       (extract-state build-steps)
                                          :startTime   (extract-start-time build-steps)
                                          :endTime     (extract-end-time build-steps)
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
