import {TOGGLE_STEP_TOOLBOX} from "actions/BuildStepActions.es6";
import R from "ramda";

export default (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_STEP_TOOLBOX: {
            let newObj = {};
            let newSubObj = {};
            newSubObj[action.stepId] = true;
            if(oldState[action.buildId]){
                if(oldState[action.buildId][action.stepId]){
                    newSubObj[action.stepId] = !oldState[action.buildId][action.stepId];
                }
                newObj[action.buildId] = R.merge(oldState[action.buildId], newSubObj);
            } else{
                newObj[action.buildId] = newSubObj;
            }
            return R.merge(oldState, newObj);
        }
        default:
            return oldState;
    }
};

