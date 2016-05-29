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

});

var PipeIcon = React.createClass({
  render: function () {
    return (
      <div className="col-md-1 text-center"><i className="fa fa-database fa-rotate-270" aria-hidden="true"></i></div>);
  }
});

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

  getInitialState: function () {
    return {steps: window.testPipeline};
  },

  updateState: function () {
    this.replaceState(window.visiblePipeline);
  },

  componentDidMount: function () {
    setInterval(this.updateState, 1000);
  },

  injectSeparatorElements: function (p, n) {
    if (p.length > 0 && p[p.length - 1].props.data.stepType != "trigger") {
      var key = "after-" + p[p.length - 1].props.data.stepId;
      return p.concat([(<PipeIcon key={key}/>), n]);
    } else {
      return p.concat([n]);
    }
  },

  render: function () {
    var buildsteps = this.state.steps.map(function (buildstep) {
      return <BuildStep key={buildstep.stepId} data={buildstep}/>
    }).reduce(this.injectSeparatorElements, []);

    return (
      <div>
        <div>
          <Breadcrumb data={this.state}/>
        </div>
        <div id="build-steps" className="horizontal-scroll-wrapper">
          {buildsteps}
        </div>
      </div>
    );

  }

});

var Breadcrumb = React.createClass({
  render: function () {

    var name = function(step) {
      if (step.stepName) {
        return step.stepName;
      } else if (step.buildNumber){
        return step.buildNumber;
      }
      else {
        return "";
      }
    };

    var calculateSteps = function(step, list){
      while(step) {
      if (!step.stepType || step.stepType !== "in-parallel" )
        list.push(step);
        step = step.parent;
      }
      return list.reverse();
    };


    var id = function(idProvider){
      if (idProvider.stepId) {
        return idProvider.stepId;
      } else if (idProvider.buildNumber) {
        return idProvider.buildNumber
      }
    };

    var renderSteps = function(steps) {
      var renderedSteps = steps.map(function(step){
        return <span key={id(step)} >&gt;
         <a href="#" onClick={function(){window.visiblePipeline=step}}>{name(step)} </a>
         </span>
      });

      return renderedSteps;
    };

    var names = calculateSteps(this.props.data, []).map(function(step) {return name(step);});
      return (<div>{renderSteps(calculateSteps(this.props.data, []))}</div>);
  }
});


