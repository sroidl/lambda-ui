import R from "ramda";
import {getFlatSteps} from "FunctionalUtils.es6";

const filterRunning = R.filter(step => step.state === "running");
const filterFailure = R.filter(step => step.state === "failure");

export const getInterestingStepId = (state, buildId) => {
    const steps = getFlatSteps(state, buildId);
    if(!steps){return null;}

    const runningSteps = filterRunning(steps);
    if(runningSteps.length > 0){
        return runningSteps[runningSteps.length -1].stepId;
    }
    const failureSteps = filterFailure(steps);
    if(failureSteps.length > 0){
        return failureSteps[failureSteps.length -1].stepId;
    }
    if (steps[steps.length - 1].state === "success"){
        return steps[steps.length - 1].stepId;
    }
    return null;
};