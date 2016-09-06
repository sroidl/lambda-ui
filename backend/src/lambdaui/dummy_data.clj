(ns lambdaui.dummy-data
  (:require [ring.util.response :refer [response header]]))

(def summaries {:summaries [{:buildId     1
                             :buildNumber 1                 ; TODO differentiate between build Number (alias) and id?
                             :state       :running
                             :startTime   "2016-12-12T12:30Z"
                             :endTime     "2016-12-12T12:35Z"}]})


(defn build-summaries [] (header (response summaries) "Access-Control-Allow-Origin" "*"))

