(ns lambdaui.fixtures.steps)

(defn success [_ _]
  {:status :success :out "success step"})

(defn killed [_ _]
  {:status :killed :out "killed step"})