import R from "ramda";
import {getFlatSteps} from "FunctionalUtils.es6";
import DevToggles from "../DevToggles.es6";

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
const getStepWithState = (stepState) => R.filter(step => step.state === stepState);
const findAndFilterStepWithState = (stepId, stepState) => R.pipe(filterStepsById(stepId), getStepWithState(stepState));
const getSubSteps = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("steps")));
const getParentStep = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("parentId")));

export const findParentOfSubstep = (state, buildId, stepId, stepState) => {
    if (!state.buildDetails) {
        return null;
    }
    const flatSteps = getFlatSteps(state, buildId);
    let foundSteps = findAndFilterStepWithState(stepId, stepState)(flatSteps);
    if (!foundSteps || foundSteps.length < 1 || !getSubSteps(foundSteps)) {
        return null;
    }

    let subSteps = getSubSteps(foundSteps);
    const steps = [];
    while (subSteps.length > 0) {
        steps.push(foundSteps[0].stepId);
        foundSteps = getStepWithState(stepState)(subSteps);
        subSteps = getSubSteps(foundSteps) || [];
    }
    if(DevToggles.useNewPipelineStructure){
        return steps;
    }
    return getParentStep(foundSteps);
};

export const findParentOfFailedSubstep = (state, buildId, stepId) => {
    return findParentOfSubstep(state, buildId, stepId, "failure");
};

export const findParentOfRunningSubstep = (state, buildId, stepId) => {
    return findParentOfSubstep(state, buildId, stepId, "running");
};