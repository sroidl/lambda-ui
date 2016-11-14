import {getFlatTree} from "FunctionalUtils.es6";
import R from "ramda";

const getBuild = buildId => R.pipe(R.view(R.lensProp("buildDetails")), R.view(R.lensIndex(buildId)));
const filterStep = stepId => R.filter(step => step.stepId === stepId);

export const isStepInParallel = (state, buildId, stepId) => {
    let buildDetails;
    try {
        buildDetails = getBuild(buildId)(state);
    } catch (err){
        // Catch all invalid states
        return false;
    }
    const flatSteps = getFlatTree(buildDetails, "steps");
    const currentStep = filterStep(stepId)(flatSteps)[0];
    const parentStepId = currentStep.parentId;
    if(parentStepId === "root"){
        return false;
    }
    const parentStep = filterStep(parentStepId)(flatSteps)[0];
    if(parentStep && parentStep.type && parentStep.type === "parallel"){
        return true;
    }
    return false;
};