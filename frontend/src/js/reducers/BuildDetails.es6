import {ADD_BUILD_DETAILS, VIEW_BUILD_STEP} from "../Actions.es6";

export const BuildDetailsReducer = (oldState={}, action) => {
  switch (action.type){
    case ADD_BUILD_DETAILS: {
      let newObj = {};
      newObj[action.buildId] = action.buildDetails;
      return Object.assign({}, oldState, newObj);
    }
    default: return oldState;
  }
};

export const ViewBuildStepReducer = (oldState={}, action) => {
  switch (action.type) {
    case VIEW_BUILD_STEP: {
      let newObj = {};
      newObj[action.buildId] = action.stepId;
      return Object.assign({}, oldState, newObj);
    }
    default: return oldState;
  }
};
