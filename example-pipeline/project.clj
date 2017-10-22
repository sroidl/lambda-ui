(defproject example-pipeline "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [lambdaui "0.4.1-SNAPSHOT"]
                 [lambdacd "0.13.1"]
                 [lambdacd-git "0.2.0"]
                 [http-kit "2.1.18"]]
  :main ^:skip-aot lambdaui.example.simple-pipeline
  :min-lein-version "2.0.0"



  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
