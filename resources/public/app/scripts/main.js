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


window.compile = {
  stepName: "Compile-to-Jar",
  stepState: "SUCCESS",
  duration: "01:23",
  stepId: "1"
};

window.deployCI = {
  stepName: "Deploy CI",
  stepState: "SUCCESS",
  duration: "01:23",
  stepId: "1-2"
};
window.deployQA = {
  stepName: "Deploy QA",
  stepState: "FAILED",
  duration: "01:23",
  stepId: "2-2"
};

window.test = {
  stepName: "test",
  stepState: "RUNNING",
  duration: "01:23",
  stepId: "3",
  steps: [
    {
      stepName: "test-bar",
      stepId: "2-3",
      stepState: "RUNNING"
    },
    {
      stepName: "test-foo",
      stepId: "1-3",
      stepState: "RUNNING"
    },
    {
      stepName: "test-baz",
      stepId: "3-3",
      stepState: "FAILED"
    }

  ]
};

window.deploy = {
  stepName: "Deploy",
  stepState: "RUNNING",
  duration: "01:23",
  stepId: "2",
  stepType: "in-parallel",
  steps: [
    deployCI,
    deployQA
  ]
};

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
            console.log(running);
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
            console.log(running);
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

window.testPipeline = {
  steps: [
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
      running("4-4", "Test Passionfruit", [running("4-4-1", "SuperCool")])
    ])
  ]
};


window.visiblePipeline = window.testPipeline;


ReactDOM.render(
  <Pipeline data={window.testPipeline}/>,
  document.getElementById('build-steps')
);

ReactDOM.render(
  <BuildSummaries/>,
  document.getElementById('build-summaries')
);
