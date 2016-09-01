#!/bin/bash
SCRIPT_DIR=$(dirname $0)

set -e

goal_test-frontend() {
  echo "Start frontend tests"
  pushd ${SCRIPT_DIR}/frontend > /dev/null
    npm test
  popd > /dev/null
}

goal_test-backend() {
  echo "Start backend tests"
  pushd ${SCRIPT_DIR}/backend > /dev/null
  ./lein test
  popd > /dev/null
}

goal_test() {
  goal_test-frontend
  goal_test-backend
}

goal_serve-backend() {
  pushd ${SCRIPT_DIR}/backend > /dev/null
  ./lein run
  popd > /dev/null
}
goal_serve-ui() {
  pushd ${SCRIPT_DIR}/frontend > /dev/null
    npm start
  popd > /dev/null
}

goal_compile-ui() {
  pushd ${SCRIPT_DIR}/frontend > /dev/null
    npm run compile
  popd > /dev/null
}

goal_run() {
  NAMESPACE="lambdaui.example.simple-pipeline"
  pushd ${SCRIPT_DIR}/backend > /dev/null
  ./lein run -m ${NAMESPACE}
  popd > /dev/null
}

goal_push() {
  goal_test
  git push
}

goal_setup() {
  pushd ${SCRIPT_DIR}/frontend > /dev/null
    npm install lodash
    npm install
  popd > /dev/null
}

goal_clean() {
  pushd ${SCRIPT_DIR}/backend > /dev/null
  ./lein clean
  popd > /dev/null
  pushd ${SCRIPT_DIR}/frontend > /dev/null
    npm run clean
  popd > /dev/null
}

goal_jar() {
 echo 'Compiling frontend'
  pushd ${SCRIPT_DIR}/frontend > /dev/null
   npm run compile
  popd > /dev/null
  if [ ! -e ${SCRIPT_DIR}/backend/resources/public ]; then
    mkdir -R ${SCRIPT_DIR}/backend/resources/public
  fi

 echo 'Compiling backend'
  cp -R frontend/target/ backend/resources/public
  pushd ${SCRIPT_DIR}/backend > /dev/null
   ./lein uberjar
  popd > /dev/null
}

goal_deploy-clojars(){
  echo "Deploying snapshot to clojars..."
  pushd ${SCRIPT_DIR}/backend > /dev/null
  ./lein deploy snapshots
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
    test      -- run tests for backend and frontend

    Frontend:
    compile-ui -- Compiles UI into resources/ui/public
    serve-ui  -- Serves UI on port 8080. Watches frontend and recompiles with webpack if necessary.
    serve-backend -- Serves the backend-for-frontend on port 4444

    Backend:
    run       -- run example pipeline"
  exit 1
fi
