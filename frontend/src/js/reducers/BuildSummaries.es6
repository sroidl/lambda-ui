import {ADD_SUMMARY} from '../Actions.es6';
import * as R from 'ramda';

const transformBuildSummary = (summary) => {
  let summaryAsMap = {};
  summaryAsMap[summary.buildId] = summary;
  return summaryAsMap;
}

const validateBuild = build =>{
  const hasAllRequiredFields = build && build.buildId && build.buildNumber && build.startTime && build.state;
  const buildIdIsNumber = build && Number.isInteger(build.buildId)
  const startTimeIsIsoString = build && ! Number.isNaN(Date.parse(build.startTime));
  return hasAllRequiredFields && buildIdIsNumber && startTimeIsIsoString;
}

const transformBuildSummaries = ([...summaries]) => {
  return R.compose(R.mergeAll, R.map(transformBuildSummary), R.filter(validateBuild))(summaries);
}

export const BuildSummariesReducer = (oldState={}, action) => {
  switch (action.type) {
    case ADD_SUMMARY:
      return Object.assign({}, oldState, transformBuildSummaries(action.summaries)); // Does this replace or add summary?
    default:
      return oldState;
  }
}
