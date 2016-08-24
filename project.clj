(defproject lambdaui "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [lambdacd "0.9.0"]
                 [compojure "1.5.0"]
                 [http-kit "2.1.18"]
                 [org.clojure/data.json "0.2.6"]
                 ]
  :test-paths ["test" "example"]
  :profiles {:dev {:dependencies [[lambdacd-git "0.1.2"]
                                  [ring-server "0.4.0"]]
                   :main lambdaui.core
                   }})
