import {SHOW_BUILD_OUTPUT, ADD_BUILDSTEP_OUTPUT, OUTPUT_CONNECTION_STATE} from "../Actions.es6";
import {HIDE_BUILD_OUTPUT} from "actions/OutputActions.es6";
import * as R from "ramda";

export const OutputReducer = (oldState = {showOutput: false}, action) => {
    switch (action.type) {
        case SHOW_BUILD_OUTPUT:
            return R.merge(oldState, {showOutput: true, buildId: action.buildId, stepId: action.stepId});

        case HIDE_BUILD_OUTPUT:
            return R.merge(oldState, {showOutput: false});

        case ADD_BUILDSTEP_OUTPUT: {
            const lens = R.lensPath(["content", action.buildId, action.stepId]);
            return R.set(lens, action.output, oldState);
        }

        case OUTPUT_CONNECTION_STATE: {
            return R.set(R.lensProp("connectionState"), action.state, oldState);
        }
        default:
            return oldState;

    }
};
