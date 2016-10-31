export const TOGGLE_BUILD_DETAILS = "toggleBuildDetails";

export const toggleBuildDetails = (id) => {
    return {type: TOGGLE_BUILD_DETAILS, buildId: id};
};
