console.log('\'Allo \'Allo!');


window.builds = [
  {
    buildNumber: 42,
    progress: 99,
    gitInformation: {
      author: "Sebastian Roidl",
      message: "LambdaUi Prototype",
      commitsSinceLastSuccess: 1
    },
    runningBuildSteps: [
      {stepName: "test-unit", "stepId": "1-1"},
      {stepName: "test-integration", "stepId": "2-1"}
    ],

    duration: {
      started: moment().format("MM/DD/YYYY -- HH:mm:ss")
    },
    buildState: "RUNNING"
  },
  {
    buildNumber: 43,
    progress: 63,
    gitInformation: {
      author: "Martha Rohte",
      message: "Add React infrastructure",
      commitsSinceLastSuccess: 42
    },

    duration: {
      started: moment().format("MM/DD/YYYY -- HH:mm:ss")
    },
    buildState: "SUCCESS"

  },
  {
    buildNumber: 46,
    progress: 63,
    gitInformation: {
      author: "Florian Sellmayr",
      message: "Add React infrastructure",
      commitsSinceLastSuccess: 42
    },
    failedBuildSteps: [
      {stepName: "deploy-ci", "stepId": "1-2"},
      {stepName: "deploy-qa", "stepId": "2-2"}
    ],
    duration: {
      started: moment().format("MM/DD/YYYY -- HH:mm:ss")
    },
    buildState: "FAILED"

  }


];


// var build = function (buildNumber, gitInformation, pipeline, buildState, progress) {
//   return {
//     buildNumber: buildNumber,
//     gitInformation: gitInformation,
//     pipeline: pipeline,
//     duration: {
//       started: moment().format("MM/DD/YYYY -- HH:mm:ss")
//     },
//     buildState: buildState,
//     progress: progress
//   }
// };

var step = function (id, name, state, steps = []) {
  var newStep = {
    stepName: name,
    stepState: state,
    duration: "01:23",
    stepId: id,
    steps: steps,

    runningBuildSteps: function () {
      if (steps.length > 0) {

        return steps.reduce(function (array, step) {
          if (step.steps && step.steps.length > 0) {
            var running = step.runningBuildSteps();
            if (running.length > 0) {
              return array.concat(running);
            }
          }
          else if (step.stepState === "RUNNING") {
            array.push(step);
          }
          return array;
        }, []);

      } else {
        return [];
      }
    },

    failedBuildSteps: function () {
      if (steps.length > 0) {

        return steps.reduce(function (array, step) {
          if (step.steps && step.steps.length > 0) {
            var running = step.failedBuildSteps();
            if (running.length > 0) {
              return array.concat(running);
            }
          }
          else if (step.stepState === "FAILED") {
            array.push(step);
          }
          return array;
        }, []);

      } else {
        return [];
      }
    }
  };

  steps.forEach(function (s) {
    s.parent = newStep
  });
  return newStep;
};

var trigger = function (id, name) {
  var step1 = step(id, name, "WAITING", []);
  step1.stepType = "trigger";
  return step1;
};

var parallel = function (id, steps = []) {
  var step1 = step(id, "", "", steps);
  step1.stepType = "in-parallel";
  return step1;
};

var success = function (id, name, steps = []) {
  return step(id, name, "SUCCESS", steps);
};

var failed = function (id, name, steps = []) {
  return step(id, name, "FAILED", steps);
};

var running = function (id, name, steps = []) {
  return step(id, name, "RUNNING", steps);
};

var Build = function (build) {
  build.runningBuildSteps = function () {
    if (this.steps.length > 0) {

      return this.steps.reduce(function (array, step) {
        if (step.steps && step.steps.length > 0) {
          var running = step.runningBuildSteps();
          if (running.length > 0) {
            return array.concat(running);
          }
        }
        else if (step.stepState === "RUNNING") {
          array.push(step);
        }
        return array;
      }, []);

    } else {
      return [];
    }
  };

  build.failedBuildSteps = function () {
    if (this.steps.length > 0) {
      return this.steps.reduce(function (array, step) {
        if (step.steps && step.steps.length > 0) {
          var running = step.failedBuildSteps();
          if (running.length > 0) {
            return array.concat(running);
          }
        }
        else if (step.stepState === "FAILED") {
          array.push(step);
        }
        return array;
      }, []);

    } else {
      return [];
    }
  };

  return build
};



window.testPipeline = [

  trigger("1"),
  running("2", "Compile-To-Jar"),
  parallel("3", [
    success("3-1", "Deploy CI"),
    failed("3-2", "Deploy QA", [failed("3-2-1", "docker-build")])
  ]),
  running("4", "Test", [
    success("4-1", "Test Banana"),
    success("4-2", "Test Apple"),
    failed("4-3", "Test Pineapple"),
    running("4-4", "Test Passionfruit", [running("4-4-1", "SuperCool")]),
  ]),
  running("5", "Go to live")
];

window.builds = {
  builds: [
    Build({
      buildNumber: 1,
      stepName: 1,
      gitInformation: {
        author: "Florian Sellmayr",
        message: "Add React infrastructure",
        commitsSinceLastSuccess: 42
      },
      duration: {
        started: moment().format("MM/DD/YYYY -- HH:mm:ss")
      },
      buildState: "FAILED",
      steps: window.testPipeline
    }),
    Build({
      buildNumber: 2,
      stepName: 2,
      progress: 99,
      gitInformation: {
        author: "Sebastian Roidl",
        message: "LambdaUi Prototype",
        commitsSinceLastSuccess: 1
      },
      duration: {
        started: moment().format("MM/DD/YYYY -- HH:mm:ss")
      },
      buildState: "RUNNING",

      steps: [
        trigger(1, "trigger"),
        success(2, "foo"),
        success(3, "bar"),
        running(4, "baz")
      ]

    }),
    Build({
      buildNumber: 3,
      stepName: 3,
      progress: 63,
      gitInformation: {
        author: "Martha Rohte",
        message: "Add React infrastructure",
        commitsSinceLastSuccess: 34
      },

      duration: {
        started: moment().format("MM/DD/YYYY -- HH:mm:ss")
      },
      buildState: "SUCCESS",

      steps: [
        trigger(1, "trigger"),
        success(2, "foo"),
        success(3, "bar"),
        success(4, "baz")
      ]

    })
  ]
};



window.visiblePipeline = window.builds.builds[0];
window.visibleBuild = undefined;




ReactDOM.render(
  <Pipeline data={window.testPipeline}/>,
  document.getElementById('build-steps')
);

ReactDOM.render(
  <BuildSummaries/>,
  document.getElementById('build-summaries')
);
