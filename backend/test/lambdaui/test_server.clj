(ns lambdaui.test-server
  (:require [lambdacd.core :as lambdacd]
            [lambdacd.execution.core :refer [run-pipeline]]
            [lambdacd.execution.internal.kill :refer [kill-all-pipelines]]
            [lambdacd.util :refer [create-temp-dir]]
            [lambdaui.core :as ui]
            [org.httpkit.server :refer [run-server]]
            [clojure.core.async :as async]
            [clojure.tools.logging :as log])
  )

(defn stop-server! [server-atom]
  (log/info "Stopping server")
  (when @server-atom (@server-atom)))

(defn start-server! [server-atom pipeline-def]
  (log/info "Starting server on port 9889")
  (let [home-dir (create-temp-dir)
        pipeline (lambdacd/assemble-pipeline pipeline-def {:home-dir home-dir})
        server (run-server (ui/pipeline-routes pipeline) {:port 9889})]
    (reset! server-atom server)
    pipeline))

(defn execute-pipeline [{def :pipeline-def ctx :context}]
  (run-pipeline def ctx))

(defn- test-with-server [pipeline-definition test-fn]
  `(let [server-atom# (atom nil)]
    (try
      (let [pipeline# (start-server! server-atom# ~pipeline-definition)]
        (execute-pipeline pipeline#))
      ~(test-fn)
      (finally
        (stop-server! server-atom#)
        ))))

(defn shutdown-pipeline [pipeline]
    (kill-all-pipelines (:context pipeline)))

(defn- test-with-server-async [pipeline-definition test-fn]
  `(let [server-atom# (atom nil)]
     (try
       (let [pipeline# (start-server! server-atom# ~pipeline-definition)]
         (async/go
           (execute-pipeline pipeline#))
         (Thread/sleep 100)
         ~(test-fn)
         (shutdown-pipeline pipeline#))
       (finally
         (stop-server! server-atom#)
         ))))

(def base "localhost:9889")

(defn test-url
  ([path] (str "http://" base path))
  ([protocol path] (str protocol base path))
  )

(defmacro with-server [pipeline-def & body]
  (test-with-server pipeline-def
    (fn [] `(do ~@body))))

(defmacro with-server-async [pipeline-def & body]
  (test-with-server-async pipeline-def
                    (fn [] `(do ~@body))))