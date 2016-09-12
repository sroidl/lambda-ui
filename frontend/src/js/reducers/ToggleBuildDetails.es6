import {TOGGLE_BUILD_DETAILS} from "../Actions.es6";

const toggleBuild = (openedBuilds, id) => {
  const newstate = {};
  newstate[id] = !openedBuilds[id];
  return newstate;
};

export const ToggleBuildDetailsReducer = (oldState={}, action) => {
  switch(action.type) {
    case TOGGLE_BUILD_DETAILS:
      return Object.assign({}, oldState, toggleBuild(oldState, action.buildId));

    default: return oldState;
  }
};
