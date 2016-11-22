export const TOGGLE_PARENT_STEPS = "toggleParentSteps";

export const toggleParentSteps = (buildId) => {
    return {type: TOGGLE_PARENT_STEPS, buildId: buildId};
};