import React from 'react';
import Moment from 'moment';
import R from 'ramda';
import Utils from './ComponentUtils.es6'
import "moment-duration-format";


const duration = ({startTime, endTime}) => {
  let start = Moment(startTime);
  let end = Moment(endTime);

  let duration = Moment.duration(end.diff(start), "milliseconds");

  return duration.format("hh:mm:ss")
}

export const BuildStep = props => {
  let {buildId, step} = props;

  return <span className={Utils.classes("buildStep", step.state)}>
    <div className="stepName">{step.name}</div>
    <div className="stepDuration">{duration(step)}</div>
  </span>
}
