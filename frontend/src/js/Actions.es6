import * as backend from "./Backend.es6";

export const TOGGLE_BUILD_DETAILS = "toggleBuildDetails";
export const ADD_SUMMARIES = "addBuildSummaries";
export const CHANGE_SUMMARY = "changeBuildSummary";
export const ADD_BUILD_DETAILS = "addBuildDetails";
export const VIEW_BUILD_STEP = "viewBuildStep";
export const ADD_CONFIGURATION = "addConfiguration";
export const SHOW_BUILD_OUTPUT = "showOutput";
export const REQUEST_OUTPUT = "requestOutput";
export const ADD_BUILDSTEP_OUTPUT = "addBuildstepOutput";
export const OUTPUT_CONNECTION_STATE = "outputConnectionState";

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

export const viewBuildStep = (buildId, stepId) => {
  return {type: VIEW_BUILD_STEP, buildId: buildId, stepId: stepId};
};

export const addConfiguration = config => {
  return {type: ADD_CONFIGURATION, config: config};
};

export const addBuildstepOutput = (buildId, stepId, output) => {
  return {type: ADD_BUILDSTEP_OUTPUT, buildId: buildId, stepId: stepId, output: output};
};

export const showBuildOutput = (buildId, stepId) => {
  return {type: SHOW_BUILD_OUTPUT, buildId: buildId, stepId: stepId};
};

export const requestOutput = (buildId, stepId) => {
  return (dispatch) => {
    backend.requestOutput(dispatch)(buildId, stepId);
  };
};

export const outputConnectionState = (connectionState) => {
  return {type: OUTPUT_CONNECTION_STATE, state: connectionState};
};
