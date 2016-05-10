#!/bin/bash
set -e

goal_test() {
  lein test
}

goal_run() {
  NAMESPACE="lambdaui.example.simple-pipeline"
  lein run -m ${NAMESPACE}
}

goal_push() {
  goal_test && git push
}

if type -t "goal_$1" &>/dev/null; then
  goal_$1 ${@:2}
else
  echo "usage: $0 <goal>
goal:
    test      -- run tests
    push      -- run all tests and push current state
    release   -- release current version
    run       -- run example pipeline"
  exit 1
fi
