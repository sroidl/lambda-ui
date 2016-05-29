#!/bin/bash
SCRIPT_DIR=$(dirname $0)

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

goal_setup() {
  pushd ${SCRIPT_DIR}/resources/public > /dev/null
    npm install
    bower install
  popd > /dev/null
}

goal_serve() {
  pushd ${SCRIPT_DIR}/resources/public > /dev/null
    node_modules/gulp/bin/gulp.js serve
  popd > /dev/null
}

if type -t "goal_$1" &>/dev/null; then
  goal_$1 ${@:2}
else
  echo "usage: $0 <goal>
goal:
    setup     -- set up environment
    serve     -- serve the ui
    test      -- run tests
    push      -- run all tests and push current state
    release   -- release current version
    run       -- run example pipeline"
  exit 1
fi
