export const TOGGLE_STEP_TOOLBOX = "toggleStepToolbox";
export const TOGGLE_PARALLEL_STEP = "toggleParallelStep";
export const TOGGLE_SUBSTEPS = "toggleSubsteps";
export const OPEN_SUBSTEPS = "openSubsteps";

export const toggleStepToolbox = (buildId, stepId) => {
    return {type: TOGGLE_STEP_TOOLBOX, buildId: buildId, stepId: stepId};
};

export const toggleParallelStep = (buildId, stepId) => {
    return {type: TOGGLE_PARALLEL_STEP, buildId: buildId, stepId: stepId};
};

export const toggleSubsteps = (buildId, stepId) => {
    return {type: TOGGLE_SUBSTEPS, buildId: buildId, stepId: stepId};
};

export const openSubsteps = (buildId, stepId) => {
    return {type: OPEN_SUBSTEPS, buildId: buildId, stepId: stepId};
};
