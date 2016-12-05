(ns lambdaui.common.summaries-test
  (:use [clojure.test]
        [lambdaui.fixtures.pipelines])
  (:require [lambdaui.common.summaries :as testee])
  (:import (org.joda.time DateTime DateTimeZone)))

(deftest summaries-test
  (testing "should calculate correct duration"
    (let [step-1-start (DateTime/parse "2016-12-05T15:00:00Z" )
          step-1-stop  (DateTime/parse "2016-12-05T15:10:00Z" )
          step-2-stop  (DateTime/parse "2016-12-05T15:11:00Z" )

          state {1 {`(2) {:most-recent-update-at step-2-stop
                         :first-updated-at step-1-stop
                         :status :success}
                    `(1) {:most-recent-update-at step-1-stop
                         :first-updated-at step-1-start
                         :status :success}}}


          actual (testee/summaries state)]
      (is (= (str step-1-start) (:startTime (first (:summaries actual)))))
          (is (= (str step-2-stop) (:endTime (first (:summaries actual))))))))


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
             (testee/summaries simple-waiting-pipeline-state)))
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :running
                           :startTime   nil
                           :endTime     nil}]}
             (testee/summaries simple-running-pipeline-state)))))
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
             (testee/summaries waiting-and-running-pipeline-state))))))




(deftest extract-start-time-test
  (testing "should extract time from single step build"
    (let [joda-date-12      (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14      (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          single-step-build {'(1) {:first-updated-at      joda-date-12
                                   :most-recent-update-at joda-date-14}}]
      (is (= "2016-01-01T12:00:00.000Z" (testee/extract-start-time single-step-build)))))
  (testing "should take time of first step from multi step build"
    (let [joda-date-12     (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14     (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          joda-date-15     (DateTime. 2016 01 01 15 00 (DateTimeZone/UTC))
          joda-date-16     (DateTime. 2016 01 01 16 00 (DateTimeZone/UTC))
          multi-step-build {'(1)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            '(1 1) {:first-updated-at      joda-date-15
                                    :most-recent-update-at joda-date-16}}]
      (is (= "2016-01-01T12:00:00.000Z" (testee/extract-start-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (testee/extract-start-time single-empty-step))))))

(deftest extract-end-time-test
  (testing "should extract time from single step build"
    (let [joda-date-12      (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14      (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          single-step-build {'(1) {:first-updated-at      joda-date-12
                                   :most-recent-update-at joda-date-14}}]
      (is (= "2016-01-01T14:00:00.000Z" (testee/extract-end-time single-step-build)))))
  (testing "should take latest available time from multi-step build"
    (let [joda-date-12     (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14     (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          joda-date-15     (DateTime. 2016 01 01 15 00 (DateTimeZone/UTC))
          joda-date-16     (DateTime. 2016 01 01 16 00 (DateTimeZone/UTC))
          multi-step-build {'(1 1) {:first-updated-at      joda-date-15
                                    :most-recent-update-at joda-date-16}
                            '(2)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            '(1)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            }]
      (is (= "2016-01-01T16:00:00.000Z" (testee/extract-end-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (testee/extract-end-time single-empty-step))))))

(deftest extract-state-test
  (testing "should be waiting if some step is waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :waiting}}
          ]
      (is (= :waiting (testee/extract-state multi-step-build1)))
      ))
  (testing "should be running if some step is running but none waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :running}}
          ]
      (is (= :running (testee/extract-state multi-step-build1)))
      ))
  (testing "should be failure if last step is failure"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :success}
                             '(3) {:status :failure}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :failure}
                             '(3) {:status :running}}]
      (is (= :failed (testee/extract-state multi-step-build1)))
      (is (= :running (testee/extract-state multi-step-build2)))))
  (testing "should be success if last step is success and no step is running or waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :success}
                             '(3) {:status :success}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :failure}
                             '(3) {:status :success}}]
      (is (= :success (testee/extract-state multi-step-build1)))
      (is (= :success (testee/extract-state multi-step-build2)))
      ))

  (testing "should be killed if some step is killed"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :killed}}
          ]

      (is (= :killed (testee/extract-state multi-step-build1)))
      )))