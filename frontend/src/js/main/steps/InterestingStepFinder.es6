import R from "ramda";
import {getFlatSteps} from "FunctionalUtils.es6";

const haveSubsteps = R.filter(step => !step.steps || step.steps.length === 0);
const filterRunning = R.pipe(R.filter(step => step.state === "running"), haveSubsteps);
const filterFailure = R.pipe(R.filter(step => step.state === "failure"), haveSubsteps);
const filterSuccess = R.pipe(R.filter(step => step.state === "success"), haveSubsteps);

export const getInterestingStepId = (state, buildId) => {
    const steps = getFlatSteps(state, buildId);
    if (!steps) {
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
    const successSteps = filterSuccess(steps);
    if (successSteps.length > 0) {
        return successSteps[successSteps.length - 1].parentId;
    }
    return null;
};