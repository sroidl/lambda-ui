export const TOGGLE_STEP_TOOLBOX = "toggleStepToolbox";

export const toggleStepToolbox = (buildId, stepId) => {
    return {type: TOGGLE_STEP_TOOLBOX, buildId: buildId, stepId: stepId};
};