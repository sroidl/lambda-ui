(ns lambdaui.api-test
  (:require [clojure.test :refer :all]
            [lambdaui.api :as api]
            [lambdacd.steps.control-flow :as ctrl-flow]
            [lambdacd.event-bus :as event-bus]
            [lambdacd.internal.pipeline-state :as state]
            [org.httpkit.server :as httpkit-server]
            [shrubbery.core :refer :all]
            [clojure.core.async :as async]
            [clojure.data.json :as json])
  (:import (org.joda.time DateTime DateTimeZone)))

(deftest summaries-test
  (testing "should extract pipeline summary for one single step pipeline"
    (let [simple-waiting-pipeline-state {1 {'(1) {:status :waiting}}}
          simple-running-pipeline-state {1 {'(1) {:status :running}}}]
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :waiting
                           :startTime   nil
                           :endTime     nil
                           }]}
             (api/summaries simple-waiting-pipeline-state)))
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :running
                           :startTime   nil
                           :endTime     nil}]}
             (api/summaries simple-running-pipeline-state)))))
  (testing "should extract pipeline summaries for more than one pipeline"
    (let [waiting-and-running-pipeline-state {1 {'(1) {:status :waiting}}
                                              2 {'(1) {:status :running}}}]
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :waiting
                           :startTime   nil
                           :endTime     nil}
                          {:buildNumber 2
                           :buildId     2
                           :state       :running
                           :startTime   nil
                           :endTime     nil}]}
             (api/summaries waiting-and-running-pipeline-state))))))

(deftest extract-state-test
  (testing "should be waiting if some step is waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :waiting}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :waiting}
                             '(3) {:status :running}}]
      (is (= :waiting (api/extract-state multi-step-build1)))
      (is (= :waiting (api/extract-state multi-step-build2)))))
  (testing "should be running if some step is running but none waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :running}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :success}}]
      (is (= :running (api/extract-state multi-step-build1)))
      (is (= :running (api/extract-state multi-step-build2)))))
  (testing "should be failure if last step is failure"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :success}
                             '(3) {:status :failure}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :failure}
                             '(3) {:status :running}}]
      (is (= :failed (api/extract-state multi-step-build1)))
      (is (= :running (api/extract-state multi-step-build2)))))
  (testing "should be success if last step is success and no step is running or waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :success}
                             '(3) {:status :success§}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :failure}
                             '(3) {:status :success}}
          multi-step-build3 {'(1) {:status :running}
                             '(2) {:status :failure}
                             '(3) {:status :success}}]
      (is (= :success (api/extract-state multi-step-build1)))
      (is (= :success (api/extract-state multi-step-build2)))
      (is (= :running (api/extract-state multi-step-build3))))))

(deftest extract-start-time-test
  (testing "should extract time from single step build"
    (let [joda-date-12      (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14      (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          single-step-build {'(1) {:first-updated-at      joda-date-12
                                   :most-recent-update-at joda-date-14}}]
      (is (= "2016-01-01T12:00:00.000Z" (api/extract-start-time single-step-build)))))
  (testing "should take time of first step from multi step build"
    (let [joda-date-12     (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14     (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          joda-date-15     (DateTime. 2016 01 01 15 00 (DateTimeZone/UTC))
          joda-date-16     (DateTime. 2016 01 01 16 00 (DateTimeZone/UTC))
          multi-step-build {'(1)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            '(1 1) {:first-updated-at      joda-date-15
                                    :most-recent-update-at joda-date-16}}]
      (is (= "2016-01-01T12:00:00.000Z" (api/extract-start-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (api/extract-start-time single-empty-step))))))

(deftest extract-end-time-test
  (testing "should extract time from single step build"
    (let [joda-date-12      (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14      (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          single-step-build {'(1) {:first-updated-at      joda-date-12
                                   :most-recent-update-at joda-date-14}}]
      (is (= "2016-01-01T14:00:00.000Z" (api/extract-end-time single-step-build)))))
  (testing "should take latest available time from multi-step build"
    (let [joda-date-12     (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14     (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          joda-date-15     (DateTime. 2016 01 01 15 00 (DateTimeZone/UTC))
          joda-date-16     (DateTime. 2016 01 01 16 00 (DateTimeZone/UTC))
          multi-step-build {'(1)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            '(1 1) {:first-updated-at      joda-date-15
                                    :most-recent-update-at joda-date-16}
                            '(2)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            }]
      (is (= "2016-01-01T16:00:00.000Z" (api/extract-end-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (api/extract-end-time single-empty-step))))))



(defn do-stuff [] {})
(defn do-other-stuff [] {})

(def foo-pipeline
  `(do-stuff))

(def pipeline-with-substeps
  `((ctrl-flow/in-parallel do-stuff do-stuff)))

(def pipeline-with-substeps-state
  (let [joda-date-12 (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
        joda-date-14 (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))]
    {'(1)   {:status                :running
             :first-updated-at      joda-date-12
             :most-recent-update-at joda-date-14
             }
     '(1 1) {:status                :running
             :first-updated-at      joda-date-12
             :most-recent-update-at joda-date-14
             }}))

(defn foo-pipeline-build-state [status]
  (let [joda-date-12 (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
        joda-date-14 (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))]
    {'(1) {:status                status
           :first-updated-at      joda-date-12
           :most-recent-update-at joda-date-14}}))


(deftest build-details-from-pipeline-test
  (testing "that it returns build details of a running step"
    (doall (for [running-status [:waiting :running :foo]]
             (let [buildId 1]
               (is (= {:buildId 1
                       :steps   [{:stepId    "1"
                                  :state     running-status
                                  :name      "do-stuff"
                                  :startTime "2016-01-01T12:00:00.000Z"
                                  :endTime   nil}]}
                      (api/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state running-status) buildId)))))))
  (testing "that it returns build details of a finished step"
    (doall (for [finished-status [:success :failure :killed]]
             (let [buildId 1]
               (is (= {:buildId 1
                       :steps   [{:stepId    "1"
                                  :state     finished-status
                                  :name      "do-stuff"
                                  :startTime "2016-01-01T12:00:00.000Z"
                                  :endTime   "2016-01-01T14:00:00.000Z"}]}
                      (api/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state finished-status) buildId)))))))
  (testing "that it returns build details"
    (let [buildId 1]
      (is (= {:buildId 1
              :steps   [{:stepId    "1"
                         :state     :running
                         :name      "in-parallel"
                         :startTime "2016-01-01T12:00:00.000Z"
                         :endTime   nil
                         :steps     [{:stepId    "1-1"
                                      :state     :running
                                      :name      "do-stuff"
                                      :startTime "2016-01-01T12:00:00.000Z"
                                      :endTime   nil}

                                     {:stepId    "2-1"
                                      :state     :pending
                                      :name      "do-stuff"
                                      :startTime nil
                                      :endTime   nil}]}]} (api/build-details-from-pipeline pipeline-with-substeps pipeline-with-substeps-state buildId))))))

(deftest output-websocket
  (testing "that a payload is sent through the ws channel"
    (let [event-channel (async/chan)
          sent-channel  (async/chan 1)
          ws-ch         (reify httpkit-server/Channel
                          (on-close [& _])
                          (send! [ws-ch data] (async/>!! sent-channel data)))]
      (with-redefs [event-bus/subscribe (fn [ctx topic] nil)
                    event-bus/only-payload (fn [subscription] event-channel)
                    state/get-all (fn [_] {})]
        (api/build-step-events-to-ws nil ws-ch 1 "2-1")
        (async/>!! event-channel {:build-number 1 :step-id [2 1] :step-result {:foo :bar}})
        (async/<!! sent-channel) ;ignore first msg. not part of test
        (is (= (json/write-str {:stepId "2-1" :buildId 1 :stepResult {:foo :bar}}) (async/<!! sent-channel)))))))

(deftest only-matching-step-test
  (testing "that it filters for matching steps"
    (let [in-ch (async/to-chan [{:build-number 1 :step-id [2 1] :step-result {:foo :bar}}
                                {:build-number 2 :step-id [2 1] :step-result {:foo :bar}}
                                {:build-number 1 :step-id [3 1] :step-result {:foo :bar}}])
          out-ch (api/only-matching-step in-ch 1 "2-1")]
      (is (= [{:buildId 1 :stepId "2-1" :stepResult {:foo :bar}}] (async/<!! (async/into [] out-ch)))))))