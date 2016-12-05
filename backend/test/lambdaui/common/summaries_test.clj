(ns lambdaui.common.summaries-test
  (:use [clojure.test])
  (:require [lambdaui.common.summaries :as testee]
            [lambdacd.core :as lcd]
            [lambdacd.util :as lcd-util]
            [lambdacd.internal.execution :as lcd-exec]
            [lambdaui.fixtures.pipelines :refer [simple-success-pipeline]]
            [lambdaui.fixtures.steps :as steps]))

(defn assemble-pipeline [pipeline-def]
  (let [config {:home-dir (lcd-util/create-temp-dir)}]
    (lcd/assemble-pipeline pipeline-def config)))

(deftest summaries-test
  (testing "pipeline should be green"
    (let [{pipe-def :pipeline-def context :context} (assemble-pipeline simple-success-pipeline)]
      (is (= :success (:status (lcd-exec/run pipe-def context)))))))
