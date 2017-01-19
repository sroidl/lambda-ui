import R from "ramda";
import * as StepActions from "../actions/BuildStepActions.es6";

export const toggleState = (oldState, buildId, stepId) => {
    const stepLens = R.lensPath([buildId, stepId]);
    const newState = R.over(stepLens, R.not, oldState);

    return newState;
};

export const buildStepsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case StepActions.TOGGLE_STEP_TOOLBOX: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        default:
            return oldState;
    }
};

export const showSubstepReducer = (oldState = {}, action) => {
    switch (action.type) {
        case StepActions.TOGGLE_SUBSTEPS: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        case StepActions.OPEN_SUBSTEPS: {
            const stepLens = R.lensPath([action.buildId, action.stepId]);
            return R.set(stepLens, true, oldState);
        }
        case StepActions.CLOSE_SUBSTEP: {
            const stepLens = R.lensPath([action.buildId, action.stepId]);
            return R.set(stepLens, false, oldState);
        }
        default:
            return oldState;
    }
};











