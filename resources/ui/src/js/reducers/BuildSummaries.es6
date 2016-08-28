import wu from 'wu';
import {ADD_SUMMARY} from '../Actions.es6'

const transformBuildSummary = (summary) => {
  let summaryAsMap = {};
  summaryAsMap[summary.buildId] = summary;
  return summaryAsMap;
}

const transformBuildSummaries = (summaries) => {
  return wu(summaries)
   .map(transformBuildSummary)
   .reduce(Object.assign, {});
}

export const BuildSummariesReducer = (oldState={}, action) => {
  switch (action.type) {
    case ADD_SUMMARY:
      return Object.assign({}, oldState, transformBuildSummaries(action.summaries)); // Does this replace or add summary?
    default:
      return oldState;
  }
}
