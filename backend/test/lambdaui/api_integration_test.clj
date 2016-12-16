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

    #_(testing "should merge trigger id with state information for top level trigger"
      (let [test-pipeline `((in-parallel wait-for-manual-trigger))]
        (with-server-async test-pipeline
                           (let [build-details (request-build-details)
                                 steps (:steps build-details)
                                 first-substep (comp first :steps)
                                 ]
                             (is (= 1 (count steps)))

                             (is (= [:stepId :name :state :startTime :endTime :type :steps :trigger]
                                    (keys (first-substep (first-substep build-details)))
                                    ))))))
    ))

