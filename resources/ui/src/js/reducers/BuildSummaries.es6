import wu from 'wu';

const ADD_SUMMARY = "addBuildSummary";

let transformBuildSummary = (summary) => {
  let summaryAsMap = {};
  summaryAsMap[summary.buildId] = summary;
  return summaryAsMap;
}

let transformBuildSummaries = (summaries) => {
  return wu(summaries)
   .map(transformBuildSummary)
   .reduce(Object.assign, {});
}

const BuildSummariesReducer = (oldState={}, action) => {
  switch (action.type) {
    case ADD_SUMMARY:
      return Object.assign({}, oldState, transformBuildSummaries(action.summaries)); // Does this replace or add summary?
    default:
      return oldState;
  }
}

export { BuildSummariesReducer, ADD_SUMMARY };
