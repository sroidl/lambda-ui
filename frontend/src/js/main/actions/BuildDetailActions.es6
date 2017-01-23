export const TOGGLE_BUILD_DETAILS = "toggleBuildDetails";
export const ADD_BUILD_DETAILS = "addBuildDetails";
export const SCROLL_TO_STEP = "scrollToStep";
export const NO_SCROLL_TO_STEP = "noScrollToStep";

export const toggleBuildDetails = (id) => {
    return {type: TOGGLE_BUILD_DETAILS, buildId: id};
};

export const addBuildDetails = (buildId, buildDetails) => {
    return {type: ADD_BUILD_DETAILS, buildId: buildId, buildDetails: buildDetails};
};

export const scrollToStep = (buildId, stepId) => {
    return {type: SCROLL_TO_STEP, buildId: buildId, stepId: stepId};
};

export const noScrollToStep = (buildId) => {
    return {type: NO_SCROLL_TO_STEP, buildId: buildId};
};