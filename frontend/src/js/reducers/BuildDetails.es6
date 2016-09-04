import {ADD_BUILD_DETAILS} from '../Actions.es6';

export const BuildDetailsReducer = (oldState={}, action) => {
  switch (action.type){
    case ADD_BUILD_DETAILS: {
      let newObj = {};
      newObj[action.buildId] = action.buildDetails;
      return Object.assign({}, oldState, newObj);
    }
    default: return oldState;
  }
}
