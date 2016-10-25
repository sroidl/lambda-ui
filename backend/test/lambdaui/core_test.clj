(ns lambdaui.core-test
  (:require [clojure.test :refer :all]
            [lambdaui.core :as subject]))

(defn- pipe-with-config [ui-config]
  {:context {:config {:ui-config ui-config}}})

(def window-def "window.lambdaui = window.lambdaui || {}; ")

(deftest create-config-test

  (testing "should define config from context"
    (is (= (str window-def "window.lambdaui.config = { name: 'super pipeline', baseUrl: hallo + 'wurst'};")
           (subject/create-config (pipe-with-config {:name "super pipeline" :location "hallo" :path-prefix "wurst"})))))
  (testing "should use defaults if fields not set"
    (is (= (str window-def "window.lambdaui.config = { name: 'Pipeline', baseUrl: window.location};")
           (subject/create-config (pipe-with-config {}))))
    ))
