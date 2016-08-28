import {ADD_SUMMARY} from '../Actions.es6';
import * as R from 'ramda';

const transformBuildSummary = (summary) => {
  let summaryAsMap = {};
  summaryAsMap[summary.buildId] = summary;
  return summaryAsMap;
}

const transformBuildSummaries = (summaries) => {
  return R.compose(R.mergeAll, R.map(transformBuildSummary))(summaries);
}

export const BuildSummariesReducer = (oldState={}, action) => {
  switch (action.type) {
    case ADD_SUMMARY:
      return Object.assign({}, oldState, transformBuildSummaries(action.summaries)); // Does this replace or add summary?
    default:
      return oldState;
  }
}
