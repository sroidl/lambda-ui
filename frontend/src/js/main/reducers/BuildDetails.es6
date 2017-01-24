import {ADD_BUILD_DETAILS} from "../actions/BuildDetailActions.es6";
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
