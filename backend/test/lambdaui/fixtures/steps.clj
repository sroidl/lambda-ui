(ns lambdaui.fixtures.steps
  (:require [lambdacd.stepsupport.output :refer [capture-output]])
  )

(defn success [_ _]
  {:status :success :out "success step"})

(defn killed [_ _]
  {:status :killed :out "killed step"})

(defn one-second-step [_ ctx]
  (capture-output ctx
                  (println "Start...")
                  (Thread/sleep 2000)
                  (println "...stop")
                  {:status :success}
                  )
  )
