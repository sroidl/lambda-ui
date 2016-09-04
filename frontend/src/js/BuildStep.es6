import React from 'react';
import Moment from 'moment';
import R from 'ramda';
import Utils from './ComponentUtils.es6'

export const BuildStep = props => {
  let {buildId, step} = props;

  return <div className={Utils.classes("buildStep", step.state)}>
    <div className="stepId">Id: {step.stepId}</div>
    <div className="stepName">Name: {step.stepId}</div>
  </div>
}
