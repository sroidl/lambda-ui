(ns lambdaui.common.summaries-test
  (:use [clojure.test]
        [lambdaui.fixtures.pipelines])
  (:require [lambdaui.common.summaries :as testee]
            [lambdacd.state.protocols :as protocols])
  (:import (org.joda.time DateTime DateTimeZone)))

(defn- iso-string [joda-date]
  (str joda-date))

(defn- joda-date [^Integer hour]
  (DateTime. 2016 01 01 hour 00 (DateTimeZone/UTC)))

(def pm-12 (joda-date 12))
(def pm-2 (joda-date 14))
(def pm-3 (joda-date 15))
(def pm-4 (joda-date 16))


(defn build-state [& steps]
  (let [step (fn [[id start end & {:as opts}]] {id (merge {:first-updated-at      start
                                                           :most-recent-update-at end} opts)})]
    (->> steps
         (map step)
         (reduce merge {}))))

(defrecord MockPipelineState [state]
  protocols/QueryAllBuildNumbersSource
  (all-build-numbers [self] (keys state))
  protocols/QueryStepResultsSource
  (get-step-results [self build-number] (get state build-number)))

(defn- started-steps-in-state [state]
  (set (for [build-number (keys state)
             step-id      (keys (get state build-number))]
         {:step-id      step-id
          :build-number build-number})))

(defn context-with-state [state]
  (let [pipeline-state (->MockPipelineState state)]
    {:pipeline-state-component pipeline-state
     :started-steps (atom (started-steps-in-state state))}))

(deftest summaries-test-duration
  (testing "should calculate correct duration"
    (let [step-1-start (DateTime/parse "2016-12-05T15:00:00Z")
          step-1-stop (DateTime/parse "2016-12-05T15:10:00Z")
          step-2-stop (DateTime/parse "2016-12-05T15:11:00Z")

          state {1 {`(2) {:most-recent-update-at step-2-stop
                          :first-updated-at      step-1-stop
                          :status                :success}
                    `(1) {:most-recent-update-at step-1-stop
                          :first-updated-at      step-1-start
                          :status                :success}}}


          actual (testee/summaries (context-with-state state))]
      (is (= (str step-1-start) (:startTime (first (:summaries actual)))))
      (is (= (str step-2-stop) (:endTime (first (:summaries actual))))))))


(deftest summaries-test
  (testing "should extract pipeline summary for one single step pipeline"
    (let [simple-waiting-pipeline-state {1 {'(1) {:status :waiting}}}
          simple-running-pipeline-state {1 {'(1) {:status :running}}}]
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :waiting
                           :duration    0
                           :startTime   nil
                           :endTime     nil}]}

             (testee/summaries (context-with-state simple-waiting-pipeline-state))))
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :running
                           :duration    0
                           :startTime   nil
                           :endTime     nil}]}
             (testee/summaries (context-with-state simple-running-pipeline-state))))))
  (testing "should extract pipeline summaries for more than one pipeline"
    (let [waiting-and-running-pipeline-state {1 {'(1) {:status :waiting}}
                                              2 {'(1) {:status :running}}}]
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :waiting
                           :duration    0
                           :startTime   nil
                           :endTime     nil}
                          {:buildNumber 2
                           :buildId     2
                           :state       :running
                           :duration    0
                           :startTime   nil
                           :endTime     nil}]}
             (testee/summaries (context-with-state waiting-and-running-pipeline-state)))))))



(deftest extract-start-time-test
  (testing "should extract time from single step build"
    (let [single-step-build {'(1) {:first-updated-at      pm-12
                                   :most-recent-update-at pm-2}}]
      (is (= "2016-01-01T12:00:00.000Z" (testee/extract-start-time single-step-build)))))
  (testing "should take time of first step from multi step build"
    (let [multi-step-build {'(1)   {:first-updated-at      pm-12
                                    :most-recent-update-at pm-2}
                            '(1 1) {:first-updated-at      pm-3
                                    :most-recent-update-at pm-4}}]
      (is (= "2016-01-01T12:00:00.000Z" (testee/extract-start-time multi-step-build)))

      (is (= 10800 (-> (testee/summaries (context-with-state {1 multi-step-build}))
                       :summaries
                       first
                       :duration)))))

  (testing "should ignore trigger timer in extract-start-time"
    (let [three-steps (build-state ['(1) pm-12 pm-2 :has-been-waiting true] ['(2) pm-2 pm-3] ['(3) pm-3 pm-4])]
        (is (= (iso-string pm-2) (testee/extract-start-time three-steps)))))


  (testing "should extract time from single step build"
    (let [single-step-build {'(1) {:first-updated-at      pm-12
                                   :most-recent-update-at pm-2}}]
      (is (= "2016-01-01T12:00:00.000Z" (testee/extract-start-time single-step-build)))))


  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (testee/extract-start-time single-empty-step))))))

(deftest extract-end-time-test
  (testing "should extract time from single step build"
    (let [single-step-build {'(1) {:first-updated-at      pm-12
                                   :most-recent-update-at pm-2}}]
      (is (= "2016-01-01T14:00:00.000Z" (testee/extract-end-time single-step-build)))))
  (testing "should take latest available time from multi-step build"
    (let [multi-step-build {'(1 1) {:first-updated-at      pm-3
                                    :most-recent-update-at pm-4
                                    :status                :success}
                            '(2)   {:first-updated-at      pm-12
                                    :most-recent-update-at pm-2
                                    :status                :success}
                            '(1)   {:first-updated-at      pm-12
                                    :most-recent-update-at pm-2
                                    :status                :success}}]

      (is (= "2016-01-01T16:00:00.000Z" (testee/extract-end-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (testee/extract-end-time single-empty-step))))))

(deftest extract-state-test
  (testing "should be waiting if some step is waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :waiting}}]

      (is (= :waiting (testee/extract-state multi-step-build1)))))

  (testing "should be running if some step is running but none waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :running}}]

      (is (= :running (testee/extract-state multi-step-build1)))))

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
      (is (= :success (testee/extract-state multi-step-build2)))))


  (testing "should be killed if some step is killed"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :killed}}]


      (is (= :killed (testee/extract-state multi-step-build1))))))
