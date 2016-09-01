export const TOGGLE_BUILD_DETAILS = 'toggleBuildDetails';
export const ADD_SUMMARIES = "addBuildSummaries";
export const CHANGE_SUMMARY = "changeBuildSummary";

export const toggleBuildDetails = (id) => {
  return {type: TOGGLE_BUILD_DETAILS, buildId: id}
}

export const addBuildSummary = (summary) => {
  return {type: ADD_SUMMARIES, summaries: summary}
}

export const changeBuildSummary = (buildId, newAttributes) => {
  return {type: CHANGE_SUMMARY, buildId: buildId, newAttributes: newAttributes}
}
