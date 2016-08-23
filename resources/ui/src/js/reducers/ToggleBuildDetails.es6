const toggleBuild = (openedBuilds, id) => {
  let oldState = openedBuilds[id] || false;
  let newstate = {};
  newstate[id] = !openedBuilds[id];
  return Object.assign({}, openedBuilds, newstate)
}

const ToggleBuildDetailsReducer = (oldState={}, action) => {
  switch(action.type) {
    case "toggleBuildDetails":
      let openedBuilds = oldState.openedBuilds;
      return Object.assign({}, oldState, toggleBuild(openedBuilds, action.buildId))
    break;

    default: return oldState;
  }
}

export default ToggleBuildDetailsReducer;
