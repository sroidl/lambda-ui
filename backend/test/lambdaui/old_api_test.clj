(ns lambdaui.old-api-test
  (:require [clojure.test :refer :all]
            [org.httpkit.server :refer [run-server]]
            [org.httpkit.client :as http]
            [lambdaui.core :refer [pipeline-routes]]
            [lambdaui.fixtures.pipelines :refer :all]
            [clojure.data.json :refer [read-json]]
            [lambdaui.test-server :refer :all]
            ))



(defn get-build [build-number builds]
  (first (filter #(= build-number (:build-number %)) builds)))

(deftest legacy-ui-routes
  (with-server simple-success-pipeline
               (testing "availability of legacy /api/builds"
                 (let [{:keys [status headers body error] :as resp} @(http/get (url "/api/builds/"))]
                    (println resp)
                   (is (= 200 status))
                   (is (= {:build-number 1 :status "success"}
                          (select-keys (get-build 1 (read-json body)) [:build-number :status :out]))))))
  )






