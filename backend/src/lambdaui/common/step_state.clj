(ns lambdaui.common.step-state)


(defn is-trigger?
  "Expects input as a raw step-state from a pipeline-state-component."
  [{:keys [has-been-waiting]}]
  (or has-been-waiting false)
  )
