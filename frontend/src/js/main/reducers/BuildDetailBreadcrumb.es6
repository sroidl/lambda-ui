import {TOGGLE_PARENT_STEPS} from "actions/BuildDetailBreadcrumbActions.es6";
import R from "ramda";

export const toggleState = (oldState, buildId) => {
    let newObject = {};
    if (oldState[buildId]) {
        newObject[buildId] = !oldState[buildId];
    } else {
        newObject[buildId] = true;
    }
    return R.merge(oldState, newObject);
};

export default (oldState = {}, action) => {
    switch (action.type) {
        case TOGGLE_PARENT_STEPS: {
            return toggleState(oldState, action.buildId);
        }
        default:
            return oldState;
    }
};

