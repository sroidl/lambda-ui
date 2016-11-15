(ns lambdaui.api-test
  (:require [clojure.test :refer :all]
            [lambdaui.api :as subject]
            [lambdacd.steps.control-flow :as ctrl-flow]
            [lambdacd.event-bus :as event-bus]
            [lambdacd.internal.pipeline-state :as state]
            [org.httpkit.server :as httpkit-server]
            [shrubbery.core :refer :all]
            [clojure.core.async :as async]
            [clojure.data.json :as json]
            [lambdacd.internal.default-pipeline-state :as default-state]
            )
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
             (subject/summaries simple-waiting-pipeline-state)))
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :running
                           :startTime   nil
                           :endTime     nil}]}
             (subject/summaries simple-running-pipeline-state)))))
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
             (subject/summaries waiting-and-running-pipeline-state))))))

(deftest extract-state-test
  (testing "should be waiting if some step is waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :waiting}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :waiting}
                             '(3) {:status :running}}]
      (is (= :waiting (subject/extract-state multi-step-build1)))
      (is (= :waiting (subject/extract-state multi-step-build2)))))
  (testing "should be running if some step is running but none waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :running}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :success}}]
      (is (= :running (subject/extract-state multi-step-build1)))
      (is (= :running (subject/extract-state multi-step-build2)))))
  (testing "should be failure if last step is failure"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :success}
                             '(3) {:status :failure}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :failure}
                             '(3) {:status :running}}]
      (is (= :failed (subject/extract-state multi-step-build1)))
      (is (= :running (subject/extract-state multi-step-build2)))))
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
      (is (= :success (subject/extract-state multi-step-build1)))
      (is (= :success (subject/extract-state multi-step-build2)))
      (is (= :running (subject/extract-state multi-step-build3))))))

(deftest extract-start-time-test
  (testing "should extract time from single step build"
    (let [joda-date-12      (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14      (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          single-step-build {'(1) {:first-updated-at      joda-date-12
                                   :most-recent-update-at joda-date-14}}]
      (is (= "2016-01-01T12:00:00.000Z" (subject/extract-start-time single-step-build)))))
  (testing "should take time of first step from multi step build"
    (let [joda-date-12     (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14     (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          joda-date-15     (DateTime. 2016 01 01 15 00 (DateTimeZone/UTC))
          joda-date-16     (DateTime. 2016 01 01 16 00 (DateTimeZone/UTC))
          multi-step-build {'(1)   {:first-updated-at      joda-date-12
                                    :most-recent-update-at joda-date-14}
                            '(1 1) {:first-updated-at      joda-date-15
                                    :most-recent-update-at joda-date-16}}]
      (is (= "2016-01-01T12:00:00.000Z" (subject/extract-start-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (subject/extract-start-time single-empty-step))))))

(deftest extract-end-time-test
  (testing "should extract time from single step build"
    (let [joda-date-12      (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC))
          joda-date-14      (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC))
          single-step-build {'(1) {:first-updated-at      joda-date-12
                                   :most-recent-update-at joda-date-14}}]
      (is (= "2016-01-01T14:00:00.000Z" (subject/extract-end-time single-step-build)))))
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
      (is (= "2016-01-01T16:00:00.000Z" (subject/extract-end-time multi-step-build)))))
  (testing "should return nil if no time found"
    (let [single-empty-step {'(1) {}}]
      (is (= nil (subject/extract-end-time single-empty-step))))))



(defn do-stuff [] {})

(def foo-pipeline
  `(do-stuff))

(def pipeline-with-substeps
  `((ctrl-flow/run do-stuff do-stuff)))

(def pipeline-with-substeps-parallel
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
                      (subject/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state running-status) buildId)))))))
  (testing "that it returns build details of a finished step"
    (doall (for [finished-status [:success :failure :killed]]
             (let [buildId 1]
               (is (= {:buildId 1
                       :steps   [{:stepId    "1"
                                  :state     finished-status
                                  :name      "do-stuff"
                                  :startTime "2016-01-01T12:00:00.000Z"
                                  :endTime   "2016-01-01T14:00:00.000Z"}]}
                      (subject/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state finished-status) buildId)))))))
  (testing "that it returns build details of nested steps"
    (let [buildId 1]
      (is (= {:buildId 1
              :steps   [{:stepId    "1"
                         :state     :running
                         :name      "run"
                         :startTime "2016-01-01T12:00:00.000Z"
                         :endTime   nil
                         :type      :container
                         :steps     [{:stepId    "1-1"
                                      :state     :running
                                      :name      "do-stuff"
                                      :startTime "2016-01-01T12:00:00.000Z"
                                      :endTime   nil}

                                     {:stepId    "2-1"
                                      :state     :pending
                                      :name      "do-stuff"
                                      :startTime nil
                                      :endTime   nil}]}]} (subject/build-details-from-pipeline pipeline-with-substeps pipeline-with-substeps-state buildId)))))

  (testing "that it returns build details of nested parallel step"
    (let [buildId 1]
      (is (= {:buildId 1
              :steps   [{:stepId    "1"
                         :state     :running
                         :name      "in-parallel"
                         :type      :parallel
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
                                      :endTime   nil}]}]} (subject/build-details-from-pipeline pipeline-with-substeps-parallel pipeline-with-substeps-state buildId))))))

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
        (subject/build-step-events-to-ws nil ws-ch 1 "2-1")
        (async/>!! event-channel {:build-number 1 :step-id [2 1] :step-result {:foo :bar}})
        (async/<!! sent-channel)                            ;ignore first msg. not part of test
        (is (= (json/write-str {:stepId "2-1" :buildId 1 :stepResult {:foo :bar}}) (async/<!! sent-channel)))))))

(deftest only-matching-step-test
  (testing "that it filters for matching steps"
    (let [in-ch  (async/to-chan [{:build-number 1 :step-id [2 1] :step-result {:foo :bar}}
                                 {:build-number 2 :step-id [2 1] :step-result {:foo :bar}}
                                 {:build-number 1 :step-id [3 1] :step-result {:foo :bar}}])
          out-ch (subject/only-matching-step in-ch 1 "2-1")]
      (is (= [{:buildId 1 :stepId "2-1" :stepResult {:foo :bar}}] (async/<!! (async/into [] out-ch)))))))


(defn wrap-websocket-channel [sent-channel]
  (reify httpkit-server/Channel
    (on-close [& _])
    (send! [_ data] (println "sending " data) (async/>!! sent-channel data))
    (close [_] nil))
  )

(defn debug [x]
  ;(println x)
  x)

(deftest details-websocket
  (testing "that a json payload is sent through the ws channel"

    (with-redefs [lambdacd.internal.pipeline-state/get-all (fn [_] {})]
      (let [pipeline {:pipeline-def pipeline-with-substeps}
            build-id "1"
            ws-ch    (async/chan 1)]
        (subject/websocket-connection-for-details pipeline build-id (wrap-websocket-channel ws-ch))
        (async/close! ws-ch)

        (is (= {:buildId "1"
                :steps   [{:stepId    "1"
                           :state     "pending"
                           :name      "run"
                           :startTime nil
                           :endTime   nil
                           :type      "container"
                           :steps     [{:stepId    "1-1"
                                        :state     "pending"
                                        :name      "do-stuff"
                                        :startTime nil
                                        :endTime   nil}

                                       {:stepId    "2-1"
                                        :state     "pending"
                                        :name      "do-stuff"
                                        :startTime nil
                                        :endTime   nil}]}]}


               (debug (json/read-json (async/<!! ws-ch))))
            )))

    ))