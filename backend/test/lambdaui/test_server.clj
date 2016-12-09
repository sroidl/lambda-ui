(ns lambdaui.test-server
  (:require [lambdacd.core :as lambdacd]
            [lambdacd.internal.execution :refer [run]]
            [lambdacd.util :refer [create-temp-dir]]
            [lambdaui.core :as ui]
            [org.httpkit.server :refer [run-server]]
            [lambdaui.fixtures.steps :as s]
            )
  )

(defn stop-server! [server-atom]
  (println "stopping server")
  (when @server-atom (@server-atom)))

(defn start-server! [server-atom pipeline-def]
  (println "Starting server on port 9889")
  (let [home-dir (create-temp-dir)
        pipeline (lambdacd/assemble-pipeline pipeline-def {:home-dir home-dir})
        server (run-server (ui/pipeline-routes pipeline) {:port 9889})]
    (reset! server-atom server)
    pipeline))

(defn execute-pipeline [{def :pipeline-def ctx :context :as pipeline}]
  (println "executing pipeline " pipeline)
  (run def ctx))

(defn- test-with-server [pipeline-definition test-fn]
  `(let [server-atom# (atom nil)]
    (try
      (println "try starting server")
      (let [pipeline# (start-server! server-atom# ~pipeline-definition)]
        (execute-pipeline pipeline#))
      ~(test-fn)
      (finally
        (stop-server! server-atom#)
        ))))

(def base "localhost:9889")

(defn url
  ([path] (str "http://" base path))
  ([protocol path] (str protocol base path))
  )

(defmacro with-server [pipeline-def & body]
  (test-with-server pipeline-def
    (fn [] `(do ~@body))))