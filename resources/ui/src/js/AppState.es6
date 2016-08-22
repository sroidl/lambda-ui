import { createStore } from 'redux'
import ToggleBuildDetailsReducer from './reducers/ToggleBuildDetails.es6'

const initialState = {
  builds: {
    1: { id: 1, state: "success", buildNumber: 1, startTime: "1:12", duration: "2 minutes" },
    2: { id: 2, state: "failed" },
    4: { id: 4, state: "running"}
  },

  openedBuilds: {}
}

const rootReducer = (oldState=initialState, action) => {
  let newState = ToggleBuildDetailsReducer(oldState, action);
  console.log("Received Action: ", action, newState);
  return newState;
}


let appState = createStore(rootReducer);
export default appState;
