(ns lambdaui.config-test
  (:require [clojure.test :refer :all]
            [lambdaui.config :as subject])
  )

(defn- pipe-with-config [ui-config]
  {:context {:config {:ui-config ui-config}}})

(def window-def "window.lambdaui = window.lambdaui || {}")

(deftest create-json-string
  (testing "should create json-string from clojure map"
    (is (= "{\"my\":\"value\",\"super\":\"value2\"}" (subject/clj-map->json-string {:my :value "super" "value2"})))))


(deftest create-config-js-test
  (testing "should create javascript-string for config-map and use default location"
    (is (= [window-def
            "window.lambdaui.config = {\"name\":\"My Pipeline\"}"
            "window.lambdaui.config.baseUrl = window.location.host"
            ]
           (subject/config->string-vec {:name "My Pipeline"}))))
  (testing "should use custom location"
    (is (= [window-def
            "window.lambdaui.config = {\"name\":\"My Pipeline\"}"
            "window.lambdaui.config.baseUrl = \"My Location\""]
           (subject/config->string-vec {:name "My Pipeline" :location "My Location"})))
    )

  (testing "should join config-vector to string"
    (is (= (str window-def ";\n"
                "window.lambdaui.config = {\"name\":\"My Pipeline\"}" ";\n"
                "window.lambdaui.config.baseUrl = \"My Location\"")
           (subject/create-config-js {:name "My Pipeline" :location "My Location"})))
    ))

(defn- pipeline-map [config]
  {:context {:config config}})

(deftest extract-config-test
  (testing "should use ui-config from pipeline-config"
    (let [input {:name "My Pipeline" :path-prefix "/hello/world"}
          pipe (pipeline-map {:ui-config input})]
      (is (= input
             (subject/extract-config pipe)))))
  (testing "should use name from pipeline if no other is specified"
    (let [pipe (pipeline-map {:name "CORE PIPELINE" :ui-config {:path-prefix "/"}})]
      (is (= {:name "CORE PIPELINE" :path-prefix "/"}
             (subject/extract-config pipe))))))

(deftest pipe->config
  (let [config-atom (atom nil)]
    (with-redefs [subject/create-config-js (fn [input] (reset! config-atom input))]
      (testing "should merge default config, extracted config and additionals"
        (let [pipe (pipeline-map {:name "LAMBDAUI PIPELINE"})
              actual (subject/pipeline->config pipe {:show-new-build-button false})]

          (is (= "LAMBDAUI PIPELINE" (:name actual)))
          (is (= false (:show-new-build-button actual)))

          )))))