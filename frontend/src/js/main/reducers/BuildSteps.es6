import {TOGGLE_STEP_TOOLBOX, TOGGLE_SUBSTEPS, OPEN_SUBSTEPS} from "actions/BuildStepActions.es6";
import {ADD_BUILD_DETAILS} from "../actions/BuildDetailActions.es6";

import R from "ramda";

export const toggleState = (oldState, buildId, stepId) => {
    const stepLens = R.lensPath([buildId, stepId]);
    const newState = R.over (stepLens, R.not, oldState);

    return newState;
};

export const buildStepsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_STEP_TOOLBOX: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        default:
            return oldState;
    }
};

//TODO: continue work here for expand/collapse fn
const addNonExistentSteps = (oldState) => {
    return oldState;
};

export const showSubstepReducer = (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_SUBSTEPS: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        case OPEN_SUBSTEPS: {
            const stepLens = R.lensPath([action.buildId, action.stepId]);
            return R.set(stepLens, true, oldState);
        }
        case ADD_BUILD_DETAILS:
            return addNonExistentSteps(oldState, action.buildDetails);

        default:
            return oldState;
    }
};











