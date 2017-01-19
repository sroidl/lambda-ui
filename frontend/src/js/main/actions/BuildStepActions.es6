export const TOGGLE_STEP_TOOLBOX = "toggleStepToolbox";
export const TOGGLE_SUBSTEPS = "toggleSubsteps";
export const OPEN_SUBSTEPS = "openSubsteps";
export const CLOSE_SUBSTEP = "closeSubstep";

export const toggleStepToolbox = (buildId, stepId) => {
    return {type: TOGGLE_STEP_TOOLBOX, buildId: buildId, stepId: stepId};
};

export const toggleSubstep = (buildId, stepId) => {
    return {type: TOGGLE_SUBSTEPS, buildId: buildId, stepId: stepId};
};

export const openSubsteps = (buildId, stepId) => {
    return {type: OPEN_SUBSTEPS, buildId: buildId, stepId: stepId};
};

export const closeSubsteps = (buildId, stepId) => {
    return {type: CLOSE_SUBSTEP, buildId: buildId, stepId: stepId};
};
