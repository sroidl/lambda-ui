import R from "ramda";

const getFailedStep = R.filter(step => step.state === "failure");
const getSubSteps = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("steps")));

export const findFailedSubstep = (state, buildId) => {
    const steps = state.buildDetails[buildId].steps;

    let foundStep = getFailedStep(steps);
    if (foundStep.length === 0){
        return null;
    }
    let subSteps = getSubSteps(foundStep);
    while (subSteps.length > 0){
        foundStep = getFailedStep(subSteps);
        subSteps = getSubSteps(foundStep);
    }
    return foundStep[0].stepId;
};


