console.log('\'Allo \'Allo!');

var PanelType = {
  RUNNING: "panel-info",
  SUCCESS: "panel-success",
  FAILED: "panel-danger"
};

var BuildSummary = React.createClass({

  render: function () {

    var panelType = PanelType[this.props.data.buildState];

    return (<div className={ "panel build-summary-container " + panelType }>
      <div className="panel-heading container-fluid">
        <h3 className="panel-title row">
          <span className="col-md-3 text-left">#{this.props.data.buildNumber}</span>
              <span className="col-md-5">
                 <ProgressBar progress={this.props.data.progress}/>
              </span>
              <span className="col-md-4 text-right">
                  <i className="fa fa-stop" aria-hidden="true"></i>
              </span>
        </h3>
      </div>

      <div className="panel-body">
        <GitInformation data={this.props.data.gitInformation}/>
        <SummaryDuration data={this.props.data.duration}/>


        <CurrentBuildSteps title="Current Buildsteps" data={this.props.data.runningBuildSteps}/>
      </div>
    </div>)
  }
});

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

var BuildSummaries = React.createClass({
  getInitialState: function () {
    return {data: window.builds};
  },
  updateState: function () {
    this.setState({data: window.builds})
  },
  componentDidMount: function () {
    setInterval(this.updateState, 1000);
  },
  render: function () {
    var summaryNodes = this.state.data.map(function (summary) {
      return (
        <BuildSummary data={summary} key={summary.buildNumber}/>
      );
    });

    return (<div className="nav navbar-nav side-nav">
      {summaryNodes}
    </div>)
  }
});

var CurrentBuildSteps = React.createClass({
  render: function () {
    var runningBuildSteps = this.props.data.map(function (runningBuildStep) {
      return (<li key={runningBuildStep.stepId}>{runningBuildStep.stepName}</li>)
    });
    return (<div className="build-info current-steps">
        <div className="media">
          <div className="media-left">
            <i className="fa fa-cog" aria-hidden="true"></i>
          </div>
          <div className="media-body">
            <div>{this.props.title}</div>
            <ul>
              {runningBuildSteps}
            </ul>
          </div>
        </div>
      </div>
    )
  }
})

var GitInformation = React.createClass({
  render: function () {
    return (
      <div className="build-info git-information">
        <div className="media">
          <div className="media-left">
            <i className="fa fa-github" aria-hidden="true"></i>
          </div>
          <div className="media-body">
            <div>{this.props.data.author}</div>
            <div><em>{this.props.data.message}</em></div>
            <a href="#">
              <small>{this.props.data.commitsSinceLastSuccess} commits since last success</small>
            </a>
          </div>
        </div>
      </div>
    )
  }
});


var SummaryDuration = React.createClass({
  render: function () {

    return (
      <div className="build-info duration">
        <div className="media">
          <div className="media-left">
            <i className="fa fa-clock-o" aria-hidden="true"></i>
          </div>
          <div className="media-body">
            <div>Started: {this.props.data.started}</div>
            <div>Duration: 5min 14sec</div>
          </div>
        </div>
      </div>
    )
  }
});

var ProgressBar = React.createClass({
  render: function () {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" role="progressbar"
             aria-valuenow={this.props.progress} aria-valuemin="0" aria-valuemax="100"
             style={{width: this.props.progress +"%" }}>
          <span className="sr-only">{this.props.progress}% Complete</span>
        </div>
      </div>)

  }
});

var BuildStep = React.createClass({
  render: function () {
    if (this.props.data.stepType === 'in-parallel') {
      return <ParallelBuildStep data={this.props.data}/>;
    } else {
      return <RegularBuildStep data={this.props.data}/>;
    }
  }
});

var ParallelBuildStep = React.createClass({


  render: function () {
    var rows = this.props.data.completedBuildSteps.map(function(step) {
      return (<div key={step.stepId} className="row"><RegularBuildStep data={step}/></div>)

    });

    return (<div>
      {rows}
    </div>)
  }
});

var RegularBuildStep = React.createClass({

  render: function () {

    var panelType = PanelType[this.props.data.stepState];


    var currentSteps;
    var steps = [];
    if (this.props.data.runningBuildSteps) {
      steps.push(<CurrentBuildSteps key="current" title="Current Buildsteps" data={this.props.data.runningBuildSteps}/>);
    }
    if (this.props.data.failedBuildSteps) {
      steps.push(<CurrentBuildSteps key="failed" title="Failed Buildsteps" data={this.props.data.failedBuildSteps}/>);
    }
    if (steps.length > 0) {
      currentSteps = <div className="panel-body">
        {steps}
      </div>;
    }

    return (
        <div className={"panel build-summary-container " + panelType}>
          <div className="panel-heading container-fluid">
            <h3 className="panel-title row">
              <span className="col-md-6 text-left">{this.props.data.stepName}</span>
                <span className="col-md-3 text-right">
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                  {this.props.data.duration}
                </span>

              <div className="col-md-3 text-right">
                <i className="fa fa-tasks padding-right" aria-hidden="true"></i>
                <i className="fa fa-expand" aria-hidden="true"></i>
              </div>
            </h3>
          </div>

          {currentSteps}
        </div>

    );

  }

})

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
    window.compile,
    window.deploy,
    window.test,
    newStep("5"),
    newStep("6"),
    newStep("7"),
    newStep("8"),
    newStep("9")
  ]
};



var Pipeline = React.createClass({

  render: function () {
    var buildsteps = this.props.data.steps.map(function (buildstep) {
      return <div key={buildstep.stepId} className="col-md-3"><BuildStep data={buildstep}/></div>
    });
    return (

      <div id="build-steps" className="horizontal-scroll-wrapper">
        {buildsteps}
      </div>
    );

  }

})


ReactDOM.render(
  <Pipeline data={window.testPipeline}/>,
  document.getElementById('build-steps')
);
