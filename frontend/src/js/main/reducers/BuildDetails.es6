import {ADD_BUILD_DETAILS, SCROLL_TO_STEP, NO_SCROLL_TO_STEP} from "../actions/BuildDetailActions.es6";
import R from "ramda";

export const BuildDetailsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case ADD_BUILD_DETAILS: {
            return R.assoc(action.buildId, action.buildDetails)(oldState);
        }
        default:
            return oldState;
    }
};

export const ScrollToStepReducer = (oldState = {}, action) => {
    switch(action.type) {
        case SCROLL_TO_STEP: {
            return R.merge(oldState, {scrollToStep: true, buildId: action.buildId, stepId: action.stepId});
        }
        case NO_SCROLL_TO_STEP: {
            return R.merge(oldState, {scrollToStep: false});
        }
        default:
            return oldState;
    }
};
