import {ADD_SUMMARIES} from '../Actions.es6';
import * as R from 'ramda';

const transformBuildSummary = (summary) => {
  let summaryAsMap = {};
  summaryAsMap[summary.buildId] = summary;
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
    console.log("BuildSummariesReducer: Reject ", build);
  }
  return keepBuild;
}

const transformBuildSummaries = ([...summaries]) => {
  return R.compose(R.mergeAll, R.map(transformBuildSummary), R.filter(validateBuild))(summaries);
}

export const BuildSummariesReducer = (oldState={}, action) => {
  switch (action.type) {
    case ADD_SUMMARIES:
      return Object.assign({}, oldState, transformBuildSummaries(action.summaries)); // Does this replace or add summary?
    default:
      return oldState;
  }
}
