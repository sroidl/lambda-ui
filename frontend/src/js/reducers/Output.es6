import {SHOW_BUILD_OUTPUT} from "../Actions.es6";

export const OutputReducer = (oldState={showOutput: false}, action) => {
  switch(action.type) {
    case SHOW_BUILD_OUTPUT:
      return {showOutput: true, buildId: action.buildId, stepId: action.stepId};
    default: return oldState;

  }
};
