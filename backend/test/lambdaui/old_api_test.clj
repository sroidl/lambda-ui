(ns lambdaui.old-api-test
  (:require [clojure.test :refer :all]
            [org.httpkit.server :refer [run-server]]
            [org.httpkit.client :as http]
            [lambdaui.core :refer [pipeline-routes]]
            [lambdaui.fixtures.pipelines :refer :all]
            [clojure.data.json :refer [read-json]]
            ))



(def server-addr "http://localhost:8874")
(def server-atom (atom nil))

(defn server [] @server-atom)
(defn url [path] (str server-addr path))

(defn- stop-server! []
  (when @server-atom (do (@server-atom) (reset! server-atom nil))))

(defn- start-server! [pipeline]
  (when @server-atom (@server-atom))
  (reset! server-atom (run-server (pipeline-routes pipeline) {:port 8874}))
  )

(defn tmp-dir []
  (lambdacd.util/create-temp-dir))

(defn stop-server-fixture [test]
  (let [pipe (lambdacd.core/assemble-pipeline simple-success-pipeline {:home-dir (tmp-dir)})]
    (start-server! pipe)
    (lambdacd.internal.execution/run (:pipeline-def pipe) (:context pipe)))

  (test)
  (stop-server!)

  )

(use-fixtures :each stop-server-fixture)



(defn get-build [build-number builds]
  (first (filter #(= build-number (:build-number %)) builds)))

(deftest legacy-ui-routes
  (testing "availability of legacy /api/builds"
    (let  [{:keys [status headers body error] :as resp} @(http/get (url "/api/builds/") )]
      (is (= 200 status))
      (is (= {:build-number 1 :status "success"}
             (select-keys (get-build 1 (read-json body)) [:build-number :status :out])))))
  )




