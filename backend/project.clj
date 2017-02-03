(defproject lambdaui "0.3.1"
  :description "LambdaCD-Plugin that provides a modern UI for your pipeline."
  :url "https://github.com/sroidl/lambda-ui"
  :license {:name "Apache License 2.0"
            :url  "http://www.apache.org/licenses/LICENSE-2.0"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [lambdacd "0.9.3"]
                 [compojure "1.5.0"]
                 [http-kit "2.1.18"]
                 [org.clojure/data.json "0.2.6"]
                 [org.slf4j/slf4j-simple "1.7.22"]
                 [trptcolin/versioneer "0.2.0"]]

  :test-paths ["test"]
  :repositories [["snapshots" { :url "https://clojars.org/repo"
                                :username [:gpg :env]
                                :password [:gpg :env]}]
                 ["releases" { :url "https://clojars.org/repo"
                                               :username [:gpg :env]
                                               :password [:gpg :env]}]]
  :lein-release {:scm :git}
  :profiles {:dev {:dependencies [[lambdacd-git "0.1.2"]
                                  [com.gearswithingears/shrubbery "0.4.1"]
                                  [ring-cors "0.1.8"]
                                  [lambdacd-artifacts "0.2.1"]]
                   :aot          [lambdaui.testpipeline.core]
                   :main         lambdaui.testpipeline.core}})
