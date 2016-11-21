export const TOGGLE_STEP_TOOLBOX = "toggleStepToolbox";
export const TOGGLE_PARALLEL_STEP = "toggleParallelStep";

export const toggleStepToolbox = (buildId, stepId) => {
    return {type: TOGGLE_STEP_TOOLBOX, buildId: buildId, stepId: stepId};
};

export const toggleParallelStep = (buildId, stepId) => {
    return {type: TOGGLE_PARALLEL_STEP, buildId: buildId, stepId: stepId};
};