(defproject example-pipeline "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [lambdaui "1.2.0-SNAPSHOT"]
                 [lambdacd "0.14.3"]
                 [lambdacd-git "0.4.1"]
                 [http-kit "2.3.0"]]
  :main ^:skip-aot lambdaui.example.simple-pipeline
  :min-lein-version "2.8.3"



  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
