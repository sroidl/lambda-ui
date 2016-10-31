export const TOGGLE_BUILD_DETAILS = "toggleBuildDetails";
export const ADD_BUILD_DETAILS = "addBuildDetails";
export const VIEW_BUILD_STEP = "viewBuildStep";

export const toggleBuildDetails = (id) => {
    return {type: TOGGLE_BUILD_DETAILS, buildId: id};
};

export const addBuildDetails = (buildId, buildDetails) => {
    return {type: ADD_BUILD_DETAILS, buildId: buildId, buildDetails: buildDetails};
};

export const viewBuildStep = (buildId, stepId) => {
    return {type: VIEW_BUILD_STEP, buildId: buildId, stepId: stepId};
};