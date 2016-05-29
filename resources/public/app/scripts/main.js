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


        <CurrentBuildSteps data={this.props.data.runningBuildSteps}/>
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
      {name:"test-unit","stepId":"1-1"},
      {name:"test-integration","stepId":"2-1"}
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
      {name:"deploy-ci","stepId":"1-2"},
      {name:"deploy-qa","stepId":"2-2"}
    ],
    duration: {
      started: ""
    },
    buildState: "SUCCESS"

  }
];

var BuildSummaries = React.createClass({
  getInitialState: function() {
    return {data: window.builds};
  },
  updateState: function () {
    this.setState({data: window.builds})
  },
  componentDidMount: function() {
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
  render: function() {
    var runningBuildSteps = this.props.data.map(function(runningBuildStep){
      return (<li key={runningBuildStep.stepId}>{runningBuildStep.name}</li>)
    });
    return (<div className="build-info current-steps">
        <div className="media">
          <div className="media-left">
            <i className="fa fa-cog" aria-hidden="true"></i>
          </div>
          <div className="media-body">
            <div>Current Buildsteps</div>
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
  render: function() {

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


ReactDOM.render(
  <BuildSummaries/>,
  document.getElementById('build-summaries')
);


