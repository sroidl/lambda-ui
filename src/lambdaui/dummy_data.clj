(ns lambdaui.dummy-data
  (:require [ring.util.response :refer [response]]))

(def summaries {:summaries [{:buildId   1
                             :state     :running
                             :startTime "11pm"              ; TODO decide on format (ISO timestamp?)
                             :duration  "30 seconds"        ; TODO decide on format (maybe seconds?)
                             },
                            {:corrupted :build}
                            ]

                })


(defn hello-response [] (response "haallo welt"))
(defn build-summaries [] (response summaries))

