import React from 'react';
import {connect} from 'react-redux';
import Moment from 'moment';
import R from 'ramda';
import Utils from './ComponentUtils.es6';
import "moment-duration-format";
import {viewBuildStep} from './Actions.es6';

const duration = ({startTime, endTime}) => {
  let start = Moment(startTime);
  let end = Moment(endTime);

  let duration = Moment.duration(end.diff(start), "milliseconds");

  return duration.format("hh:mm:ss");
};

export const BuildStep = props => {
  let {buildId, step, goIntoStepFn} = props;

  let infos = <div><div className="stepName">{step.name}</div> <div className="stepDuration">{duration(step)}</div></div>;

  if (step.steps === undefined || step.steps.length === 0) {
    return <span className={Utils.classes("buildStep", step.state)}>
            {infos}
           </span>;
  }
  else {
    return <a className={Utils.classes("buildStep", "goIntoStepLink", step.state)} href="#" onClick={goIntoStepFn}>
            {infos}
           </a>;
  }
};

const mapStateToProps = (state, ownProps) => {
  return ownProps;
};

const mapDispatchToProps = (dispatch,ownProps) => {
  return {goIntoStepFn: () => dispatch(viewBuildStep(ownProps.buildId, ownProps.step.stepId))};
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildStep);
