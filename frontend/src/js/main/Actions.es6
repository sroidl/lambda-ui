export const TOGGLE_BUILD_DETAILS = "toggleBuildDetails";
export const ADD_SUMMARIES = "addBuildSummaries";
export const CHANGE_SUMMARY = "changeBuildSummary";
export const ADD_BUILD_DETAILS = "addBuildDetails";
export const VIEW_BUILD_STEP = "viewBuildStep";
export const ADD_CONFIGURATION = "addConfiguration";
export const SHOW_BUILD_OUTPUT = "showOutput";
export const ADD_BUILDSTEP_OUTPUT = "addBuildstepOutput";
export const OUTPUT_CONNECTION_STATE = "outputConnectionState";


// DETAILS
export const toggleBuildDetails = (id) => {
    return {type: TOGGLE_BUILD_DETAILS, buildId: id};
};


// SUMMARY
export const addBuildSummary = (summary) => {
    return {type: ADD_SUMMARIES, summaries: summary};
};

// SUMMARY
export const changeBuildSummary = (buildId, newAttributes) => {
    return {type: CHANGE_SUMMARY, buildId: buildId, newAttributes: newAttributes};
};

// DETAILS
export const addBuildDetails = (buildId, buildDetails) => {
    return {type: ADD_BUILD_DETAILS, buildId: buildId, buildDetails: buildDetails};
};


// DETAILS
export const viewBuildStep = (buildId, stepId) => {
    return {type: VIEW_BUILD_STEP, buildId: buildId, stepId: stepId};
};


//CONFIG
export const addConfiguration = config => {
    return {type: ADD_CONFIGURATION, config: config};
};


// OUTPUT
export const addBuildstepOutput = (buildId, stepId, output) => {
    return {type: ADD_BUILDSTEP_OUTPUT, buildId: buildId, stepId: stepId, output: output};
};


// OUTPUT
export const showBuildOutput = (buildId, stepId) => {
    return {type: SHOW_BUILD_OUTPUT, buildId: buildId, stepId: stepId};
};


// OUTPUT
export const outputConnectionState = (connectionState) => {
    return {type: OUTPUT_CONNECTION_STATE, state: connectionState};
};
