(ns lambdaui.api-test
  (:require [clojure.test :refer :all]
            [lambdaui.api-legacy :as subject]
            [lambdacd.steps.control-flow :as ctrl-flow]
            [lambdacd.event-bus :as event-bus]
            [lambdacd.internal.pipeline-state :as state]
            [org.httpkit.server :as httpkit-server]
            [shrubbery.core :refer :all]
            [clojure.core.async :as async]
            [clojure.data.json :as json]
            [lambdacd.internal.default-pipeline-state :as default-state])

  (:import (org.joda.time DateTime DateTimeZone)))

(def joda-date-12 (DateTime. 2016 01 01 12 00 (DateTimeZone/UTC)))
(def joda-date-12-str "2016-01-01T12:00:00.000Z")

(def joda-date-14 (DateTime. 2016 01 01 14 00 (DateTimeZone/UTC)))
(def joda-date-14-str "2016-01-01T14:00:00.000Z")

(defn do-stuff [] {})

(def foo-pipeline
  `(do-stuff))

(def pipeline-with-substeps
  `((ctrl-flow/run do-stuff do-stuff)))

(def pipeline-with-substeps-parallel
  `((ctrl-flow/in-parallel do-stuff do-stuff)))

(def pipeline-with-substeps-state
  {'(1)   {:status                :running
           :first-updated-at      joda-date-12
           :most-recent-update-at joda-date-14}

   '(1 1) {:status                :running
           :first-updated-at      joda-date-12
           :most-recent-update-at joda-date-14}})


(defn foo-pipeline-build-state [status]
  {'(1) {:status                status
         :first-updated-at      joda-date-12
         :most-recent-update-at joda-date-14}})

(defn pipeline-build-state-with-trigger [status]
  {'(1) {:status                status
         :first-updated-at      joda-date-12
         :most-recent-update-at joda-date-14
         :type                  :manual-trigger}})




(deftest build-details-from-pipeline-test
  (testing "that it returns build details of a running step"
    (doall (for [running-status [:waiting :running :foo]]
             (let [buildId 1]
               (is (= {:buildId 1
                       :steps   [{:stepId    "1"
                                  :state     running-status
                                  :name      "do-stuff"
                                  :startTime joda-date-12-str
                                  :type      :step
                                  :steps     []
                                  :endTime   nil}]}
                      (subject/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state running-status) buildId nil)))))))
  (testing "that it returns build details of a finished step"
    (doall (for [finished-status [:success :failure :killed]]
             (let [buildId 1]
               (is (= {:buildId 1
                       :steps   [{:stepId    "1"
                                  :state     finished-status
                                  :name      "do-stuff"
                                  :type      :step
                                  :steps     []
                                  :startTime joda-date-12-str
                                  :endTime   joda-date-14-str}]}
                      (subject/build-details-from-pipeline foo-pipeline (foo-pipeline-build-state finished-status) buildId nil)))))))
  (testing "that it returns build details of nested steps"
    (let [buildId 1]
      (is (= {:buildId 1
              :steps   [{:stepId    "1"
                         :state     :running
                         :name      "run"
                         :startTime joda-date-12-str
                         :endTime   nil
                         :type      :container
                         :steps     [{:stepId    "1-1"
                                      :state     :running
                                      :type      :step
                                      :steps     []
                                      :name      "do-stuff"
                                      :startTime joda-date-12-str
                                      :endTime   nil}

                                     {:stepId    "2-1"
                                      :state     :pending
                                      :name      "do-stuff"
                                      :type      :step
                                      :steps     []
                                      :startTime nil
                                      :endTime   nil}]}]} (subject/build-details-from-pipeline pipeline-with-substeps pipeline-with-substeps-state buildId nil)))))

  (testing "that it returns build details of nested parallel step"
    (let [buildId 1]
      (is (= {:buildId 1
              :steps   [{:stepId    "1"
                         :state     :running
                         :name      "in-parallel"
                         :type      :parallel
                         :startTime joda-date-12-str
                         :endTime   nil
                         :steps     [{:stepId    "1-1"
                                      :state     :running
                                      :type      :step
                                      :steps     []
                                      :name      "do-stuff"
                                      :startTime joda-date-12-str
                                      :endTime   nil}

                                     {:stepId    "2-1"
                                      :state     :pending
                                      :name      "do-stuff"
                                      :type      :step
                                      :steps     []
                                      :startTime nil
                                      :endTime   nil}]}]} (subject/build-details-from-pipeline pipeline-with-substeps-parallel pipeline-with-substeps-state buildId nil))))))

(deftest output-websocket
  (testing "that a payload is sent through the ws channel"
    (let [event-channel (async/chan)
          sent-channel (async/chan 1)
          ws-ch (reify httpkit-server/Channel
                  (on-close [& _])
                  (send! [ws-ch data] (async/>!! sent-channel data)))]
      (with-redefs [event-bus/subscribe (fn [ctx topic] nil)
                    event-bus/only-payload (fn [subscription] event-channel)
                    state/get-all (fn [_] {})]
        (subject/output-events nil ws-ch 1 "2-1")
        (async/>!! event-channel {:build-number 1 :step-id [2 1] :step-result {:foo :bar}})
        (async/<!! sent-channel)                            ;ignore first msg. not part of test
        (is (= (json/write-str {:stepId "2-1" :buildId 1 :stepResult {:foo :bar}}) (async/<!! sent-channel))))))

  (testing "that a websocket is closed if step is finished"
    (let [

          event-channel (async/chan)
          sent-channel (async/chan 1)
          closed (atom false)
          ws-ch (reify httpkit-server/Channel
                  (on-close [& _])
                  (close [ws-ch] (reset! closed true))
                  (send! [ws-ch data] (async/>!! sent-channel data)))]
      (with-redefs [event-bus/subscribe (fn [ctx topic] nil)
                    event-bus/only-payload (fn [subscription] event-channel)
                    state/get-all (fn [_] {})]
        (subject/output-events nil ws-ch 1 "2-1")
        (async/>!! event-channel {:build-number 1 :step-id [2 1] :stepResult {:status :running}})
        (async/>!! event-channel {:build-number 1 :step-id [2 1] :stepResult {:status :success}})

        (println (async/<!! sent-channel))                  ;ignore first msg. not part of test
        (println (async/<!! sent-channel))))))
        ;(is (= true @closed))




(deftest only-matching-step-test
  (testing "that it filters for matching steps"
    (let [in-ch (async/to-chan [{:build-number 1 :step-id [2 1] :step-result {:foo :bar}}
                                {:build-number 2 :step-id [2 1] :step-result {:foo :bar}}
                                {:build-number 1 :step-id [3 1] :step-result {:foo :bar}}])
          out-ch (subject/only-matching-step in-ch 1 "2-1")]
      (is (= [{:buildId 1 :stepId "2-1" :stepResult {:foo :bar}}] (async/<!! (async/into [] out-ch)))))))


(defn wrap-websocket-channel [sent-channel]
  (reify httpkit-server/Channel
    (on-close [& _])
    (send! [_ data] (println "sending " data) (async/>!! sent-channel data))
    (close [_] nil)))


(defn debug [x]
  ;(println x)
  x)

(deftest details-websocket
  (testing "that a json payload is sent through the ws channel"

    (with-redefs [lambdacd.internal.pipeline-state/get-all (fn [_] {})]
      (let [pipeline {:pipeline-def pipeline-with-substeps}
            build-id "1"
            ws-ch (async/chan 1)]
        (subject/websocket-connection-for-details pipeline build-id (wrap-websocket-channel ws-ch))
        (async/close! ws-ch)

        (is (= {:buildId "1"
                :steps   [{:stepId    "1"
                           :state     "pending"
                           :name      "run"
                           :startTime nil
                           :endTime   nil
                           :type      "container"
                           :steps     [{:stepId    "1-1"
                                        :state     "pending"
                                        :name      "do-stuff"
                                        :type      "step"
                                        :steps     []
                                        :startTime nil
                                        :endTime   nil}

                                       {:stepId    "2-1"
                                        :state     "pending"
                                        :name      "do-stuff"
                                        :type      "step"
                                        :steps     []
                                        :startTime nil
                                        :endTime   nil}]}]}


               (debug (json/read-json (async/<!! ws-ch)))))))))

(defn- clear-killed-atom []
  (reset! subject/killed-steps #{}))

(deftest kill-step-test
  (testing "should call kill step only once"

    (clear-killed-atom)

    (let [kill-counter (atom 0)]
      (with-redefs [lambdacd.core/kill-step (fn [& _] (swap! kill-counter inc))]
        (subject/kill-step "1" "1" nil)
        (subject/kill-step "1" "1" nil)

        (is (= 1 @kill-counter))))))



