(ns lambdaui.test-utils
  (:import (java.nio.file.attribute FileAttribute)
           (java.nio.file Files)))

(defn- no-file-attributes []
  (into-array FileAttribute []))

(def temp-prefix "lambdaui-test")

(defn create-temp-dir []
   (str (Files/createTempDirectory temp-prefix (no-file-attributes))))
