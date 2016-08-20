#!/bin/bash
SCRIPT_DIR=$(dirname $0)

set -e

goal_test() {
  lein test
}

goal_serve-ui() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    python -m SimpleHTTPServer 8080
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

goal_sass() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm run sass-watch
  popd > /dev/null
}

goal_sass-once() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm run sass-once
  popd > /dev/null

}

goal_js-once() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm run js-once
  popd > /dev/null
}

goal_js() {
  pushd ${SCRIPT_DIR}/resources/ui > /dev/null
    npm run js-watch
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
    sass      -- watch sass folder and compile on demand
    sass-once -- compile sass folder once
    js        -- watch js-src folder and compile es6 & react files into plain old js.
    js-once   -- compile js-src folder once.
    serve-ui  -- starts a web server that serves the UI folder on port 8080. (Python required)

    Backend:
    test      -- run tests
    run       -- run example pipeline"
  exit 1
fi
