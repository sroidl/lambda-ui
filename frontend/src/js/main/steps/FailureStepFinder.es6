import R from "ramda";

const isStepFailed = (step) => {
    return step.state === "failure";
};

const createStepIdFilter = (stepId) => {
    const stepIdFilter = (step) => {
        return step.stepId === stepId && isStepFailed(step);
    };

    return stepIdFilter;
};

export const findFailedSubstep = (state, buildId, stepId) => {
    const steps = state.buildDetails[buildId].steps;

    const foundStep = R.filter(createStepIdFilter(stepId),steps);
    if (foundStep.length === 0){
        return null;
    }
    const subSteps = foundStep[0].steps;
    if (subSteps.length > 0){
        const foundSubSteps = R.filter(isStepFailed, subSteps);
        if (foundSubSteps.length === 1){
            return foundSubSteps[0].stepId;
        }
    }
    return foundStep[0].stepId;
};
