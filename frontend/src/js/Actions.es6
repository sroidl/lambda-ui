export const TOGGLE_BUILD_DETAILS = "toggleBuildDetails";
export const ADD_SUMMARIES = "addBuildSummaries";
export const CHANGE_SUMMARY = "changeBuildSummary";
export const ADD_BUILD_DETAILS = "addBuildDetails";
export const VIEW_BUILD_STEP = "viewBuildStep";
export const ADD_CONFIGURATION = "addConfiguration";


export const toggleBuildDetails = (id) => {
  return {type: TOGGLE_BUILD_DETAILS, buildId: id};
};

export const addBuildSummary = (summary) => {
  return {type: ADD_SUMMARIES, summaries: summary};
};

export const changeBuildSummary = (buildId, newAttributes) => {
  return {type: CHANGE_SUMMARY, buildId: buildId, newAttributes: newAttributes};
};

export const addBuildDetails = buildDetails => {
  return {type: ADD_BUILD_DETAILS, buildId: buildDetails.buildId, buildDetails: buildDetails};
};

export const viewBuildStep = (buildId, step) => {
  return {type: VIEW_BUILD_STEP, buildId: buildId, stepId: step};
};

export const addConfiguration = config => {
  return {type: ADD_CONFIGURATION, config: config};
};
