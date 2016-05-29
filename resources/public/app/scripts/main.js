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
      author: "Florian Sellmayr",
      message: "Add React infrastructure",
      commitsSinceLastSuccess: 42
    },
    runningBuildSteps: [
      {stepName: "deploy-ci", "stepId": "1-2"},
      {stepName: "deploy-qa", "stepId": "2-2"}
    ],
    duration: {
      started: ""
    },
    buildState: "SUCCESS"

  }
];

ReactDOM.render(
  <BuildSummaries/>,
  document.getElementById('build-summaries')
);


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
  runningBuildSteps: [
    {stepName: "test-foo", "stepId": "1-3"},
    {stepName: "test-bar", "stepId": "2-3"}
  ],
  failedBuildSteps: [
    {stepName: "test-baz", "stepId": "3-3"}
  ]
};

window.deploy = {
  stepName: "Deploy",
  stepState: "RUNNING",
  duration: "01:23",
  stepId: "2",
  stepType: "in-parallel",
  completedBuildSteps: [
    deployCI,
    deployQA
  ]
};

var newTrigger = function(id) {
  return {
    stepId: id,
    stepType: "trigger",
    stepState: "SUCCESS"
  }
}

var newStep = function(id) {
  return {
    stepName: "Compile-to-Jar",
    stepState: "SUCCESS",
    duration: "01:23",
    stepId: id
  };
}


window.testPipeline = {
  steps: [
    newTrigger("22"),
    window.compile,
    window.deploy,
    newTrigger("24"),
    window.test,
    newStep("5"),
    newStep("6"),
    newStep("9")
  ]
};

ReactDOM.render(
  <Pipeline data={window.testPipeline}/>,
  document.getElementById('build-steps')
);



