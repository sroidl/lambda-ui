export const TOGGLE_BUILD_DETAILS = 'toggleBuildDetails';
export const ADD_SUMMARIES = "addBuildSummaries";

export const toggleBuildDetails = (id) => {
  return {type: TOGGLE_BUILD_DETAILS, buildId: id}
}

export const addBuildSummary = (summary) => {
  return {type: ADD_SUMMARIES, summaries: summary}
}
