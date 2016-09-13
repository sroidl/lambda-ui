(ns lambdaui.api-test
  (:require [clojure.test :refer :all]
            [lambdaui.api :as api]))

(deftest summaries-test
  (testing "should extract pipeline summary for one single step pipeline"
    (let [simple-waiting-pipeline-state {1 {'(1) {:status :waiting}}}
          simple-running-pipeline-state {1 {'(1) {:status :running}}}]
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :waiting}]}
             (api/summaries simple-waiting-pipeline-state)))
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :running}]}
             (api/summaries simple-running-pipeline-state)))))
  (testing "should extract pipeline summaries for more than one pipeline"
    (let [waiting-and-running-pipeline-state {1 {'(1) {:status :waiting}}
                                              2 {'(1) {:status :running}}}]
      (is (= {:summaries [{:buildNumber 1
                           :buildId     1
                           :state       :waiting}
                          {:buildNumber 2
                           :buildId     2
                           :state       :running}]}
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
      (is (= :failure (api/extract-state multi-step-build1)))
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

;If one step is waiting, return waiting
;If one step is running, return running
;If last step failed, return failed (?)
;If all steps are successful, return success?


