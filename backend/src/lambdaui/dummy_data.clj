(ns lambdaui.dummy-data
  (:require [ring.util.response :refer [response header]]))

(def summaries {:summaries [{:buildId   1
                             :buildNumber 1                 ; TODO differentiate between build Number (alias) and id?
                             :state     :running
                             :startTime "11pm"              ; TODO decide on format (ISO timestamp?)
                             :duration  "30 seconds"        ; TODO decide on format (maybe seconds?)
                             },
                            {:corrupted :build}
                            ]

                })


(defn hello-response [] (response "haallo welt"))
(defn build-summaries [] (header (response summaries) "Access-Control-Allow-Origin" "*"))

