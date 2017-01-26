import {ADD_BUILDSTEP_OUTPUT, HIDE_BUILD_OUTPUT, OUTPUT_CONNECTION_STATE, SHOW_BUILD_OUTPUT, CHANGE_TAB} from "../actions/OutputActions.es6";
import * as R from "ramda";

export const OutputReducer = (oldState = {}, action) => {
    switch (action.type) {
        case SHOW_BUILD_OUTPUT:
            return R.merge(oldState, {showOutput: true, buildId: action.buildId, stepId: action.stepId, activeTab: action.activeTab});

        case HIDE_BUILD_OUTPUT:
            return R.merge(oldState, {showOutput: false});

        case ADD_BUILDSTEP_OUTPUT: {
            const lens = R.lensPath(["content", action.buildId, action.stepId]);
            return R.set(lens, action.output, oldState);
        }
        case OUTPUT_CONNECTION_STATE: {
            return R.set(R.lensProp("connectionState"), action.state, oldState);
        }
        case CHANGE_TAB: {
            return R.merge(oldState, {activeTab: action.activeTab});
        }
        default:
            return oldState;
    }
};
