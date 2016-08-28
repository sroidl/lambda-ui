export const TOGGLE_BUILD_DETAILS = 'toggleBuildDetails';
export const ADD_SUMMARY = "addBuildSummary";

export const newToggleBuildDetailsAction = (id) => {
  return {type: TOGGLE_BUILD_DETAILS, buildId: id}
}

export const addBuildSummary = (...summary) => {
  return {type: ADD_SUMMARY, summaries: summary}
}
