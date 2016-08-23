(ns lambdaui.bff
  (:require [org.httpkit.server :as http])
  (:use [org.httpkit.server])
  )

(def channel "my-first-channel")

(defonce c (atom nil))

(defn response [req]
  (println "Received Request in response")
  (reset! c (with-channel req channel
                          (on-close channel (fn [status] (println "channel closed: " status)))
                          (on-receive channel (fn [data]    ;; echo it back
                                                (send! channel data)))))
  )

(defn handler [req]
  (println "Received Request " req)
  (response req))



(defonce server (atom nil))

(defn start-server [] (reset! server (run-server handler {:port 4444})))