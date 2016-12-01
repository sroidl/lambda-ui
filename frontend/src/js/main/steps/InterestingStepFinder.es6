import R from "ramda";
import {getFlatSteps} from "FunctionalUtils.es6";

const haveSubsteps = R.filter(step => !step.steps || step.steps.length === 0);
const filterRunning = R.pipe(R.filter(step => step.state === "running"), haveSubsteps);
const filterFailure = R.pipe(R.filter(step => step.state === "failure"), haveSubsteps);
const filterWaiting = R.pipe(R.filter(step => step.state === "waiting"), haveSubsteps);

export const shouldShowInterestingStep = (state, buildId) => {
    if(!state.viewBuildSteps){
        return false;
    }
    return state.viewBuildSteps[buildId] === "__showInterestingStep";
};

export const getInterestingStepId = (state, buildId) => {
    const steps = getFlatSteps(state, buildId);
    if (!steps || !state.viewBuildSteps) {
        return null;
    }

    const runningSteps = filterRunning(steps);
    if (runningSteps.length > 0) {
        return runningSteps[runningSteps.length - 1].parentId;
    }
    const failureSteps = filterFailure(steps);
    if (failureSteps.length > 0) {
        return failureSteps[failureSteps.length - 1].parentId;
    }
    const waitingSteps = filterWaiting(steps);
    if (waitingSteps.length > 0) {
        return waitingSteps[waitingSteps.length - 1].parentId;
    }
    return null;
};


const filterStepsById = stepId => R.filter(step => step.stepId === stepId);
const getFailedStep = R.filter(step => step.state === "failure");
const findAndFilterFailedStep = stepId => R.pipe(filterStepsById(stepId), getFailedStep());
const getSubSteps = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("steps")));
const getParentStep = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("parentId")));

export const findParentOfFailedSubstep = (state, buildId, stepId) => {
    if (!state.buildDetails) {
        return null;
    }
    const flatSteps = getFlatSteps(state, buildId);
    let foundSteps = findAndFilterFailedStep(stepId)(flatSteps);
    if (!foundSteps || foundSteps.length < 1 || !getSubSteps(foundSteps)) {
        return null;
    }

    let subSteps = getSubSteps(foundSteps);
    while (subSteps.length > 0) {
        foundSteps = getFailedStep(subSteps);
        subSteps = getSubSteps(foundSteps) || [];
    }
    return getParentStep(foundSteps);
};