var PanelType = {
  RUNNING: "panel-info",
  SUCCESS: "panel-success",
  FAILED: "panel-danger"
};


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
