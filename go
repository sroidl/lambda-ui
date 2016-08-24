#!/bin/bash
SCRIPT_DIR=$(dirname $0)

set -e

goal_test() {
  lein test
}

goal_serve-backend() {
  lein run
}
goal_serve-ui() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm start
  popd > /dev/null
}

goal_compile-ui() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm run compile
  popd > /dev/null
}

goal_run() {
  NAMESPACE="lambdaui.example.simple-pipeline"
  lein run -m ${NAMESPACE}
}

goal_push() {
  goal_test && git push
}

goal_setup() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm install
  popd > /dev/null
}

goal_clean() {
  lein clean
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm run clean
  popd > /dev/null
}

if type -t "goal_$1" &>/dev/null; then
  goal_$1 ${@:2}
else
  echo "usage: $0 <goal>
goal:
    All:
    push      -- run all tests and push current state
    setup     -- set up environment
    clean     -- clean all generated files

    Frontend:
    compile-ui -- Compiles UI into resources/ui/public
    serve-ui  -- Serves UI on port 8080. Watches frontend and recompiles with webpack if necessary.
    serve-backend -- Serves the backend-for-frontend on port 4444

    Backend:
    test      -- run tests
    run       -- run example pipeline"
  exit 1
fi
