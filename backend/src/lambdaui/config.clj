(ns lambdaui.config
  (:require [clojure.data.json :as json]
            [clojure.string :as string]
            [lambdaui.common.collections :refer [combine]])
  )

(def default-lambdaui-navbar {:navbar {:links [{:url "https://github.com/sroidl/lambda-ui/labels/bug"
                                        :text        "Known Issues/Report Bug"}]}})




(defn extract-location [location]
  (when (not (= location :backend-location)) location))

(defn escape-string [s]
  (str "\"" s "\""))

(defn clj-map->json-string [m]
  (json/write-str m))

(defn config->string-vec [config]
  (let [l (extract-location (:location config))
        location (if l (escape-string l) "window.location.host")
        path-prefix (:path-prefix config "")
        config (dissoc config :location :path-prefix)
        ]
    (-> []
        (conj "window.lambdaui = window.lambdaui || {}")
        (conj (str "window.lambdaui.config = " (clj-map->json-string config)))
        (conj (str "window.lambdaui.config.baseUrl = " location " + \"" path-prefix "\""))
        )))

(defn create-config-js [config]
  (string/join ";\n" (config->string-vec config)))

(defn extract-config [pipeline]
  (let [ui-config (get-in pipeline [:context :config :ui-config] {})
        pipeline-config (get-in pipeline  [:context :config] {})
        name {:name (or (:name ui-config) (:name pipeline-config) "PIPELINE")}]
    (merge ui-config name)))

(defn filter-nil-value [[k v]]
  (not (nil? v)))

(defn filter-nil-values [m]
  (into {} (filter filter-nil-value m)))

(defn pipeline->config [pipeline & [additional-config]]
  (let [default-config {:showStartBuildButton false}
        extracted (filter-nil-values (extract-config pipeline))
        additional-config (filter-nil-values (or additional-config {}))
        lambdaui-navbar (if (:showDefaultNavbar additional-config true) default-lambdaui-navbar {})
        config (combine default-config extracted additional-config lambdaui-navbar)]

    (create-config-js config)))


