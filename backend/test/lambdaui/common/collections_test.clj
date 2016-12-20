(ns lambdaui.common.collections-test
  (:require [clojure.test :refer :all]
            [lambdaui.common.collections :as subject])
  )

(deftest combine-test
  (testing "last value wins if applied to non collections"
    (is (= :last (subject/combine :first :second "peter" :last))))

  (testing "last value wins if not all are sequence"
    (is (= :last (subject/combine [1 2 3] '(:one :two :three) :last)))
    (is (= '(:one :two :three) (subject/combine [1 2 3] :last '(:one :two :three)))))

  (testing "last value wins if not all are sequence"
    (is (= :last (subject/combine [1 2 3] '(:one :two :three) :last)))
    (is (= '(:one :two :three) (subject/combine [1 2 3] :last '(:one :two :three)))))

  (testing "collections should be concat'd"
    (is (= '(1 2 :one :two one two) (subject/combine [1 2] '(:one :two) '(one two)))))

  (testing "maps should be deep-merged"
    (let [m1 {:one :value_1
              :two {:key :value_1}
              :three [1]}
          m2 {:one :value_2
              :two {:second :value}
              :three [2]}
          expected {:one :value_2
                    :two {:key :value_1
                          :second :value}
                    :three [1 2]}]
      (is (= expected (subject/combine m1 m2)))
      )

    (let [m1 {:deep {:coll [1]}
              :last_wins {:some :thing}}

          m2 {:deep {:coll [2]}
              :last_wins [:no :map]}

          expected {:deep {:coll [1 2]}
                    :last_wins [:no :map]}]
      (is (= expected (subject/combine m1 m2))))))
