(ns lambdaui.common.details
  (:require [lambdaui.common.common :as common]
            [lambdacd.presentation.unified :as presentation]
            [lambdacd.state.core :as state]))

(defn- to-iso-string [timestamp]
  (when timestamp
    (str timestamp)))

(defn get-type [step]
  (when-let [type (:type step)]
    (case type
      :manual-trigger :trigger
      type)))

(defn- to-ui-params [params]
  (let [f (fn [[p-name props]] {:key (name p-name) :name (:desc props)})]
    (map f params)))

(defn get-trigger-data [trigger-path-prefix step]
  (let [trigger-id (get-in step [:result :trigger-id])
        url-template "%s/api/dynamic/%s"
        parameters (if-let [params (:parameters (:result step))] {:parameter (to-ui-params params)} {})
        url {:url (format url-template trigger-path-prefix trigger-id)}]
    (if (seq trigger-id)
      {:trigger (merge url parameters)}
      {})))

(defn to-output-format [trigger-path-prefix step]
  (let [status (:status (:result step))
        trigger (get-trigger-data trigger-path-prefix step)
        base {:stepId    (common/step-id->str (:step-id step))
              :name      (:name step)
              :state     (or status :pending)
              :startTime (to-iso-string (:first-updated-at (:result step)))
              :endTime   (when (common/finished? status) (to-iso-string (:most-recent-update-at (:result step))))
              :details   (get-in step [:result :details] [])}
        type (if (empty? trigger) {:type (get-type step)} {:type :trigger})
        children (if-let [children (:children step)] {:steps (map (partial to-output-format trigger-path-prefix) children)} {})]
    (merge base type children trigger)))

(defn build-details-from-pipeline [pipeline-def pipeline-state build-id ui-config]
  (let [unified-steps-map (->> (presentation/unified-presentation pipeline-def pipeline-state)
                               (map (partial to-output-format (:path-prefix ui-config "")))
                               (map (fn [step] [(:stepId step) step]))
                               (into {}))
        steps (vals unified-steps-map)]

    {:buildId build-id
     :steps   steps}))

(defn build-details-response [pipeline build-id]
  (let [build-state (state/get-step-results (:context pipeline) (Integer/parseInt build-id))
        pipeline-def (:pipeline-def pipeline)]
    (build-details-from-pipeline pipeline-def build-state build-id (get-in pipeline [:context :config :ui-config]))))
