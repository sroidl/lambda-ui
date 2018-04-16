(ns lambdaui.test-utils
  (:import (java.nio.file.attribute FileAttribute)
           (java.nio.file Files)
           (java.util.concurrent TimeoutException)))

(defn- no-file-attributes []
  (into-array FileAttribute []))

(def temp-prefix "lambdaui-test")

(defn create-temp-dir []
   (str (Files/createTempDirectory temp-prefix (no-file-attributes))))

(defn wait-for
  "executes `f` until `predicate` on `f`'s result is true, then return the result"
  [f predicate]
  (loop [time-slept 0]
    (if (> time-slept 10000)
      (throw (TimeoutException. "waited for too long")))
    (let [result (f)]
      (if (not (predicate result))
        (do
          (Thread/sleep 50)
          (recur (+ time-slept 50)))
        result))))
