(ns lambdaui.config)

(defn extract-location [location]
  (when (not (= location :backend-location)) location))

(defn create-config-legacy [pipeline & {:keys [show-new-build-button]}]
  (let [config (get-in pipeline [:context :config])
        ui-config (get config :ui-config)
        name (or (:name ui-config) (:name config) "Pipeline")
        location (or (extract-location (:location ui-config)) "window.location.host")
        path-prefix (:path-prefix ui-config)
        prefix (if path-prefix (str " + '" path-prefix "'") "")
        location (str location prefix)
        ]

    (str "window.lambdaui = window.lambdaui || {}; "
         "window.lambdaui.config = { name: '" name "', baseUrl: " location "};"))
  )



