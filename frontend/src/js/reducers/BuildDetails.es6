import {ADD_BUILD_DETAILS, VIEW_BUILD_STEP, ADD_BUILDSTEP_OUTPUT} from "../Actions.es6";
import {mapTree} from "../FunctionalUtils.es6";
import * as R from  "ramda";

export const BuildDetailsReducer = (oldState={}, action) => {
  switch (action.type){
    case ADD_BUILD_DETAILS: {
      const newObj = {};
      newObj[action.buildId] = action.buildDetails;
      return Object.assign({}, oldState, newObj);
    }

    case ADD_BUILDSTEP_OUTPUT: {
      const {buildId, stepId} = action;
      const buildDetails = oldState[buildId];
      if(!buildDetails) { return oldState; }
      const addOutput = step => {
        if (step.stepId === stepId) {
          const oldOutput = step.output || [];
          const result = Object.assign({}, step, {output: R.concat(oldOutput, action.output)});
          return result;
        }
        return step;
      };

      const newBuildDetails = Object.assign({}, buildDetails, mapTree(addOutput)(buildDetails));
      const newState = Object.assign({}, oldState);
      newState[buildId] = newBuildDetails;
      return newState;
    }
    default: return oldState;
  }
};

export const ViewBuildStepReducer = (oldState={}, action) => {
  switch (action.type) {
    case VIEW_BUILD_STEP: {
      const newObj = {};
      newObj[action.buildId] = action.stepId;
      return Object.assign({}, oldState, newObj);
    }
    default: return oldState;
  }
};
