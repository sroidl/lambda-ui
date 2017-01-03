import {POLLING_BUILD_DETAILS} from "actions/BackendActions.es6";
import R from "ramda";

export const pollingReducer = (oldState={}, action) => {
    switch (action.type) {
        case POLLING_BUILD_DETAILS: {
            return R.assoc(action.buildId, action.active, oldState);
        }
        default: return oldState;
    }
};