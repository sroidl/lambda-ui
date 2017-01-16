(ns lambdaui.common.details-test
  (:require [clojure.test :refer :all]
            [lambdaui.common.details :as subject]
            [lambdacd.steps.control-flow :as ctrl-flow]
            [shrubbery.core :refer :all])

  (:import (org.joda.time DateTime DateTimeZone)))

(def joda-date-12 (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC)))
(def joda-date-12-str "2016-01-01T12:00:00.000Z")

(def joda-date-14 (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC)))
(def joda-date-14-str "2016-01-01T14:00:00.000Z")

(defn do-stuff [] {})

(def foo-pipeline
  `(do-stuff))

(def pipeline-with-substeps
  `((ctrl-flow/run do-stuff do-stuff)))

(def pipeline-with-substeps-parallel
  `((ctrl-flow/in-parallel do-stuff do-stuff)))

(def pipeline-with-substeps-state
  {'(1)   {:status                :running
           :first-updated-at      joda-date-12
           :most-recent-update-at joda-date-14}

   '(1 1) {:status                :running
           :first-updated-at      joda-date-12
           :most-recent-update-at joda-date-14}})

(defn foo-pipeline-build-state [status]
  {'(1) {:status                status
         :first-updated-at      joda-date-12
         :most-recent-update-at joda-date-14}})


(deftest build-details-from-pipeline-test
         (testing "that it returns build details of a running step"
                  (doall (for [running-status [:waiting :running :foo]]
                           (let [buildId 1]
                             (is (= {:buildId 1
                                     :steps   [{:stepId    "1"
                                                :state     running-status
                                                :name      "do-stuff"
                                                :startTime joda-date-12-str
                                                :type      :step
                                                :steps     []
                                                :endTime   nil}]}
                                    (subject/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state running-status) buildId nil)))))))
         (testing "that it returns build details of a finished step"
                  (doall (for [finished-status [:success :failure :killed]]
                           (let [buildId 1]
                             (is (= {:buildId 1
                                     :steps   [{:stepId    "1"
                                                :state     finished-status
                                                :name      "do-stuff"
                                                :type      :step
                                                :steps     []
                                                :startTime joda-date-12-str
                                                :endTime   joda-date-14-str}]}
                                    (subject/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state finished-status) buildId nil)))))))
         (testing "that it returns build details of nested steps"
                  (let [buildId 1]
                    (is (= {:buildId 1
                            :steps   [{:stepId    "1"
                                       :state     :running
                                       :name      "run"
                                       :startTime joda-date-12-str
                                       :endTime   nil
                                       :type      :container
                                       :steps     [{:stepId    "1-1"
                                                    :state     :running
                                                    :type      :step
                                                    :steps     []
                                                    :name      "do-stuff"
                                                    :startTime joda-date-12-str
                                                    :endTime   nil}

                                                   {:stepId    "2-1"
                                                    :state     :pending
                                                    :name      "do-stuff"
                                                    :type      :step
                                                    :steps     []
                                                    :startTime nil
                                                    :endTime   nil}]}]} (subject/build-details-from-pipeline pipeline-with-substeps pipeline-with-substeps-state buildId nil)))))

         (testing "that it returns build details of nested parallel step"
                  (let [buildId 1]
                    (is (= {:buildId 1
                            :steps   [{:stepId    "1"
                                       :state     :running
                                       :name      "in-parallel"
                                       :type      :parallel
                                       :startTime joda-date-12-str
                                       :endTime   nil
                                       :steps     [{:stepId    "1-1"
                                                    :state     :running
                                                    :type      :step
                                                    :steps     []
                                                    :name      "do-stuff"
                                                    :startTime joda-date-12-str
                                                    :endTime   nil}

                                                   {:stepId    "2-1"
                                                    :state     :pending
                                                    :name      "do-stuff"
                                                    :type      :step
                                                    :steps     []
                                                    :startTime nil
                                                    :endTime   nil}]}]} (subject/build-details-from-pipeline pipeline-with-substeps-parallel pipeline-with-substeps-state buildId nil))))))
