import { createStore } from 'redux'

const initialState = {
  builds: {
    1: { id: 1, state: "success", buildNumber: 1, startTime: "1:12", duration: "2 minutes" },
    2: { id: 2, state: "failed" },
    4: { id: 4, state: "running"}
  },

  openedBuilds: {}
}

const rootReducer = (oldState=initialState, action) => {
  let newState = toggleBuildDetails(oldState, action);
  console.log("Received Action: ", action, newState);
  return newState;
}

const toggleBuild = (openedBuilds, id) => {
  let oldState = openedBuilds[id] || false;
  let newstate = {};
  newstate[id] = !openedBuilds[id];
  return Object.assign({}, openedBuilds, newstate)
}

const toggleBuildDetails = (oldState, action) => {
  switch(action.type) {
    case "toggleBuildDetails":
      let openedBuilds = oldState.openedBuilds;
      return Object.assign({}, oldState, {openedBuilds: toggleBuild(openedBuilds, action.buildId)})
    break;

    default: return oldState;
  }
}

let appState = createStore(rootReducer);
export default appState;
