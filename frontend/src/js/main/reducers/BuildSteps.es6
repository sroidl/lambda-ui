import {TOGGLE_STEP_TOOLBOX, TOGGLE_SUBSTEPS, OPEN_SUBSTEPS} from "actions/BuildStepActions.es6";
import R from "ramda";

export const toggleState = (oldState, buildId, stepId) => {
    const newObj = {};
    const newSubObj = {};
    newSubObj[stepId] = true;
    if (oldState[buildId]) {
        if (oldState[buildId][stepId]) {
            newSubObj[stepId] = !oldState[buildId][stepId];
        }
        newObj[buildId] = R.merge(oldState[buildId], newSubObj);
    } else {
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

export const showSubstepReducer = (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_SUBSTEPS: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        case OPEN_SUBSTEPS: {
            if(oldState[action.buildId] && oldState[action.buildId][action.stepId]){
                return oldState;
            }
            return toggleState(oldState, action.buildId, action.stepId);
        }
        default:
            return oldState;
    }
};











