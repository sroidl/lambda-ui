import {SHOW_BUILD_OUTPUT, ADD_BUILDSTEP_OUTPUT} from "../Actions.es6";
import * as R from "ramda";

export const OutputReducer = (oldState={showOutput: false}, action) => {
  switch(action.type) {
    case SHOW_BUILD_OUTPUT:
      return {showOutput: true, buildId: action.buildId, stepId: action.stepId};

    case ADD_BUILDSTEP_OUTPUT: {
        const lens = R.lensPath(["content", action.buildId, action.stepId]);
        return R.set(lens, action.output, oldState);
      }
    default: return oldState;

  }
};
