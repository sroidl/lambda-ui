var BuildSummary = React.createClass({



    render: function () {
      var component = this;

      var currentBuildSteps = function () {
        if (component.props.data.runningBuildSteps && component.props.data.runningBuildSteps().length > 0) {
          return (buildSteps = <CurrentBuildSteps title="Current Buildsteps" data={component.props.data.runningBuildSteps()}/>);
        }
      };

      var failedBuildSteps = function () {
        if (component.props.data.failedBuildSteps && component.props.data.failedBuildSteps().length > 0) {
          return (buildSteps = <CurrentBuildSteps title="Failed Buildsteps" data={component.props.data.failedBuildSteps()}/>);
        }
      };




      var panelType = PanelType[this.props.data.buildState];
      var progressbar, stopButton, rebuildButton, buildSteps;
      if (panelType === PanelType.RUNNING) {
        progressbar = <ProgressBar progress={this.props.data.progress}/>;
        stopButton = <i className="fa fa-stop" aria-hidden="true"></i>;

      }

      if (panelType !== PanelType.RUNNING) {
        rebuildButton = <i className="fa fa-repeat" aria-hidden="true"></i>;
      }


      return (<div className={ "panel build-summary-container " + panelType }>
        <div className="panel-heading container-fluid">
          <h3 className="panel-title row">
            <span className="col-md-3 text-left">
            <a href="#" onClick={function() {
              window.visiblePipeline = component.props.data;
            }}  >
              #{this.props.data.buildNumber}
            </a>
            </span>
              <span className="col-md-5">
                 {progressbar}
              </span>
              <span className="col-md-4 text-right">
                {stopButton}
                {rebuildButton}
              </span>
          </h3>
        </div>

        <div className="panel-body">
          <GitInformation data={this.props.data.gitInformation}/>
          <SummaryDuration data={this.props.data.duration}/>
          {currentBuildSteps()}
          {failedBuildSteps()}
        </div>
      </div>)
    }
  })
  ;

var BuildSummaries = React.createClass({
  getInitialState: function () {
    return {data: window.builds.builds};
  },
  updateState: function () {
    this.setState({data: window.builds.builds})
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

          </div>
        </div>
      </div>
    )
  }
});


