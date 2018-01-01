(ns lambdaui.common.common
  (:require [clojure.string :as string]
            [lambdacd.util :as util]))

(defn finished? [status]
  (contains? #{:success :failure :killed} status))

(defn step-id->str [step-id]
  (clojure.string/join "-" step-id))

(defn str->step-id [dash-seperated-step-id]
  (map util/parse-int (string/split dash-seperated-step-id #"-")))

