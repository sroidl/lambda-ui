import {TOGGLE_STEP_TOOLBOX, TOGGLE_PARALLEL_STEP} from "actions/BuildStepActions.es6";
import R from "ramda";

export const toggleState = (oldState, buildId, stepId) => {
    let newObj = {};
    let newSubObj = {};
    newSubObj[stepId] = true;
    if(oldState[buildId]){
        if(oldState[buildId][stepId]){
            newSubObj[stepId] = !oldState[buildId][stepId];
        }
        newObj[buildId] = R.merge(oldState[buildId], newSubObj);
    } else{
        newObj[buildId] = newSubObj;
    }
    return R.merge(oldState, newObj);
};

export default (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_STEP_TOOLBOX: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        default:
            return oldState;
    }
};

export const ParallelStepsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_PARALLEL_STEP: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        default:
            return oldState;
    }
};

