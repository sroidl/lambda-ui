import {ADD_BUILD_DETAILS, SCROLL_TO_STEP, NO_SCROLL_TO_STEP} from "actions/BuildDetailActions.es6";
import R from "ramda";

export const BuildDetailsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case ADD_BUILD_DETAILS: {
            const newObj = {};
            newObj[action.buildId] = action.buildDetails;
            return Object.assign({}, oldState, newObj);
        }

        default:
            return oldState;
    }
};

export const ScrollToStepReducer = (oldState = {}, action) => {
    switch(action.type) {
        case SCROLL_TO_STEP: {
            const newObj = {scrollToStep: true, buildId: action.buildId, stepId: action.stepId};
            return R.merge(oldState, newObj);
        }
        case NO_SCROLL_TO_STEP: {
            const newObj = {scrollToStep: false};
            return R.merge(oldState, newObj);
        }
        default:
            return oldState;
    }
};
