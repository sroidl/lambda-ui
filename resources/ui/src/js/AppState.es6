import { createStore, combineReducers } from 'redux'
import {ToggleBuildDetailsReducer} from './reducers/ToggleBuildDetails.es6'
import { BuildSummariesReducer, ADD_SUMMARY } from './reducers/BuildSummaries.es6'

const initialState = {
  summaries: {
    1: { id: 1, state: "success", buildNumber: 1, startTime: "1:12", duration: "2 minutes" },
    2: { id: 2, state: "failed" },
    4: { id: 4, state: "running"}
  },

  openedBuilds: {}
}

const LogReducer = (state={}, action) => {
  console.log('DEBUG. Received ', action);
  return state;
}

const rootReducer = combineReducers({
  LogReducer,
  openedBuilds: ToggleBuildDetailsReducer,
  summaries:  BuildSummariesReducer
})


const appState = createStore(rootReducer);

export default appState;
