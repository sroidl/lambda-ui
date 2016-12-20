(ns lambdaui.common.collections)

(defn deep-merge
  "Recursively merges maps. If vals are not maps, the last value wins."
  [& vals]
  (if (every? map? vals)
    (apply merge-with deep-merge vals)
    (last vals)))

(defn combine
  "Combines all values.
  If all values are maps, it will merge them, applying combine to all their shared keys.
  If all values are sequences, all of them will be concat'd.
  If non of the above is true, the right-most value wins.
   "
  [& values]

  (cond
    (every? map? values) (apply merge-with combine values)
    (every? sequential? values) (apply concat values)
    :else (last values)))