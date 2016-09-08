(ns lambdaui.api-test
  (:require [clojure.test :refer :all]
            [lambdaui.api :as api]))

(deftest summaries-test
  (testing "should extract pipeline status for one single step pipeline"
    (let [simple-waiting-pipeline-state {1 {'(1) {:status :waiting}}}
          simple-running-pipeline-state {1 {'(1) {:status :running}}}]
      (is (= {:summaries [{:state :waiting}]} (api/summaries simple-waiting-pipeline-state)))
      (is (= {:summaries [{:state :running}]} (api/summaries simple-running-pipeline-state)))))
  (testing "should extract pipeline status for more than one pipeline"
    (let [waiting-and-running-pipeline-state {1 {'(1) {:status :waiting}}
                                              2 {'(1) {:status :running}}}]
      (is (= {:summaries [{:state :waiting}
                          {:state :running}]} (api/summaries waiting-and-running-pipeline-state))))))

(deftest extract-state-test
  (testing "should be waiting if some step is waiting"
    (let [multi-step-build1 {'(1) {:status :success}
                             '(2) {:status :running}
                             '(3) {:status :waiting}}
          multi-step-build2 {'(1) {:status :success}
                             '(2) {:status :waiting}
                             '(3) {:status :running}}]
      (is (= :waiting (api/extract-state multi-step-build1)))
      (is (= :waiting (api/extract-state multi-step-build2))))))

;If one step is waiting, return waiting
;If one step is running, return running
;If last step failed, return failed (?)
;If all steps are successful, return success?


