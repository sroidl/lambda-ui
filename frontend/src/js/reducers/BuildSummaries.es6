import {ADD_SUMMARIES, CHANGE_SUMMARY} from '../Actions.es6';
import * as R from 'ramda';

const transformBuildSummary = (summary) => {
  let summaryAsMap = {};
  let startTimeDateObj = new Date(Date.parse(summary.startTime));
  summaryAsMap[summary.buildId] = Object.assign({}, summary, {startTime: startTimeDateObj})
  return summaryAsMap;
}

const validateBuild = build =>{
  if (! build) {
    return false;
  }
  const hasAllRequiredFields = build.buildId && build.buildNumber && build.startTime && build.state;
  const buildIdIsNumber = Number.isInteger(build.buildId)
  const startTimeIsIsoString = !Number.isNaN(Date.parse(build.startTime));
  const durationIsANumber = build.duration === undefined || Number.isInteger(build.duration)
  const stateIsValid = build.state === 'running'
      || build.state === 'failed'
      || build.state === 'success'
      || build.state === 'pending';

  const keepBuild = hasAllRequiredFields && buildIdIsNumber && startTimeIsIsoString && durationIsANumber && stateIsValid;
  if (! keepBuild) {
    // console.log("BuildSummariesReducer: Reject ", build);
  }
  return keepBuild;
}

const transformBuildSummaries = ([...summaries]) => {
  return R.compose(R.mergeAll, R.map(transformBuildSummary), R.filter(validateBuild))(summaries);
}

const changeSummary = (oldState, buildId, newAttributes) => {
  if (!oldState[buildId]){
    return oldState;
  }
  return Object.assign({}, oldState, transformBuildSummary(Object.assign({}, oldState[buildId], newAttributes)));
}

export const BuildSummariesReducer = (oldState={}, action) => {
  switch (action.type) {
    case ADD_SUMMARIES:
      return Object.assign({}, oldState, transformBuildSummaries(action.summaries)); // Does this replace or add summary?
    case CHANGE_SUMMARY:
      return changeSummary(oldState, action.buildId, action.newAttributes);
    default:
      return oldState;
  }
}
