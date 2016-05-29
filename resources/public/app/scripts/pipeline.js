
  var BuildStep = React.createClass({
    render: function () {
      if (this.props.data.stepType === 'in-parallel') {
        return <div className="col-md-3"><ParallelBuildStep data={this.props.data}/></div>;
      } else if (this.props.data.stepType === 'trigger') {
        return <div className="col-md-1 text-center"><TriggerStep data={this.props.data}/></div>;
      } else {
        return <div className="col-md-3"><RegularBuildStep data={this.props.data}/></div>;
      }
    }
  });

  var ParallelBuildStep = React.createClass({


    render: function () {
      var rows = this.props.data.steps.map(function (step) {
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
      if (this.props.data.runningBuildSteps().length > 0) {
        steps.push(<CurrentBuildSteps key="current" title="Current Buildsteps"
                                      data={this.props.data.runningBuildSteps()}/>);
      }
      if (this.props.data.failedBuildSteps().length > 0) {
        steps.push(<CurrentBuildSteps key="failed" title="Failed Buildsteps" data={this.props.data.failedBuildSteps()}/>);
      }
      if (steps.length > 0) {
        currentSteps = <div className="panel-body">
          {steps}
        </div>;
      }

      var props = this.props;

      var zoomIntoSubSteps = function () {
        window.visiblePipeline = props.data;
      };

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

                <a href="#" onClick={zoomIntoSubSteps}>
                <i className="fa fa-expand" aria-hidden="true"></i>
                </a>
              </div>
            </h3>
          </div>

          {currentSteps}
        </div>

      );

    }

  })

  var TriggerStep = React.createClass({
    render: function () {

      return (
        <div>
          <i className="fa fa-caret-right fa-2x" aria-hidden="true"></i>
          <i className="fa fa-caret-right fa-2x" aria-hidden="true"></i>
          <i className="fa fa-caret-right fa-2x" aria-hidden="true"></i>
        </div>
      );
    }
  });

  var Pipeline = React.createClass({

    getInitialState: function(){
      return window.testPipeline;
    },

    updateState: function() {
      this.setState(window.visiblePipeline);
    },

    componentDidMount: function(){
      setInterval(this.updateState, 1000);
    }
    ,

    render: function () {
      var buildsteps = this.state.steps.map(function (buildstep) {
        return <BuildStep key={buildstep.stepId} data={buildstep}/>
      });
      return (

        <div id="build-steps" className="horizontal-scroll-wrapper">
          {buildsteps}
        </div>
      );

    }

  });



