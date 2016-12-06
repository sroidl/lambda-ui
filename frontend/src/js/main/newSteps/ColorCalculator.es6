import {getFlatSteps} from "../FunctionalUtils.es6";
import R from "ramda";

const getColorClass = count => {
    switch(count){
        case 0:
            return "StepWhite";
        case 1:
            return "StepLevel1";
        case 2:
            return "StepLevel2";
        case 3:
            return "StepLevel3";
        case 4:
            return "StepLevel4";
        case 5:
            return "StepLevel5";
        case 6:
            return "StepLevel6";
        default:
            return "";
    }
};

export const calculateStepColor = (state, buildId, stepId) => {
    const flatSteps = getFlatSteps(state,buildId);

    let step = R.filter(step => step.stepId === stepId)(flatSteps)[0];

    if(!step.steps || step.steps.length === 0){
        return getColorClass(0);
    }

    let levelCount = 1;

    while(step.parentId !== "root"){
        const newStepId = step.parentId;
        step = R.filter(step => step.stepId === newStepId)(flatSteps)[0];
        levelCount++;
    }

    return getColorClass(levelCount);
};