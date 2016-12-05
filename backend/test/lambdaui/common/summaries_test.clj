(ns lambdaui.common.summaries-test
  (:use [clojure.test]
        [lambdaui.fixtures.pipelines])
  (:require [lambdaui.common.summaries :as testee])
  (:import (org.joda.time DateTime)))

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

