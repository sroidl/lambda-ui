(ns lambdaui.json-util
  (:require [cheshire.core :as ch]
            [clj-time.format :as f]
            [cheshire.generate :as chg])
  (:import (com.fasterxml.jackson.core JsonGenerator)
           (org.joda.time DateTime)))

(def iso-formatter (f/formatters :date-time))

(chg/add-encoder DateTime (fn [v ^JsonGenerator jsonGenerator] (.writeString jsonGenerator ^String (f/unparse iso-formatter v))))

(defn to-json [v] (ch/generate-string v))
(defn json-response [data]
  {:headers { "Content-Type" "application/json;charset=UTF-8"}
   :body (to-json data)
   :status 200 })
