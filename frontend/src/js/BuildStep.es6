import React from 'react';
import Moment from 'moment';
import R from 'ramda';

export const classes = (...classes) => {
  return R.reduce((c, acc)=> acc + ' ' + c, '')(classes).trim();
}

export const BuildStep = props => {
  let {buildId, step} = props;

  return <div className={classes("buildStep")}>
    <div className="stepId">Id: {step.stepId}</div>
    <div className="stepName">Name: {step.stepId}</div>
  </div>
}
