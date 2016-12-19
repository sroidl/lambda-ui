(ns lambdaui.api-integration-test
  (:require [clojure.test :refer :all]
            [lambdaui.fixtures.steps :refer :all]
            [lambdaui.test-server :refer [with-server with-server-async test-url]]
            [lambdacd.steps.manualtrigger :refer :all]
            [lambdacd.steps.control-flow :refer [in-parallel]]
            [clojure.core.async :as async]
            [org.httpkit.client :as http]
            [clojure.data.json :as json]
            )
  (:import (org.joda.time DateTime DateTimeZone)))

(defn- request-build-details []
  (->> @(http/get (test-url "/lambdaui/api/builds/1"))
       :body
       json/read-json
       ))

(deftest test-manual-trigger
  (with-redefs [clj-time.core/now (fn [] (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC)))]

    (testing "should merge trigger id with state information for top level trigger"
      (let [test-pipeline `(wait-for-manual-trigger)]
        (with-server-async test-pipeline
                           (let [build-details (request-build-details)
                                 steps (:steps build-details)]
                             (is (= 1 (count steps)))
                             (is (= [:stepId :name :state :startTime :endTime :type :steps :trigger] (keys (first steps))))))))

    (testing "should merge trigger id with state information for top level trigger"
      (let [test-pipeline `((in-parallel wait-for-manual-trigger))]
        (with-server-async test-pipeline
                           (let [build-details (request-build-details)
                                 steps (:steps build-details)
                                 first-substep (comp first :steps)

                                 expected {:buildId "1"
                                           :steps   [{:endTime   nil
                                                      :name      "in-parallel"
                                                      :startTime "2016-01-01T12:00:00.000Z"
                                                      :state     "running"
                                                      :stepId    "1"
                                                      :steps     [{:endTime   nil
                                                                   :name      "wait-for-manual-trigger"
                                                                   :startTime nil
                                                                   :state     "pending"
                                                                   :stepId    "1-1"
                                                                   :steps     []
                                                                   :trigger {:url "/api/dynamic/7edb1e04-73cf-4207-9cca-e72a8f1d09ee"}
                                                                   :type      "trigger"}]
                                                      :type      "parallel"}]}

                                 ]
                             (is (= 1 (count steps)))
                             (is (= [:stepId :name :state :startTime :endTime :type :steps :trigger]
                                    (keys (first-substep (first-substep build-details)))
                                    ))))))
    ))

