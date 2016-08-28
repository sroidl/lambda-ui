import { createStore, combineReducers } from 'redux'
import {ToggleBuildDetailsReducer} from './reducers/ToggleBuildDetails.es6'
import { BuildSummariesReducer, ADD_SUMMARY } from './reducers/BuildSummaries.es6'

const initialState = {
  summaries: {
    1: { buildId: 1, state: "success", buildNumber: 1, startTime: "1:12", duration: "2 minutes" },
    2: { buildId: 2, buildNumber: 2, state: "failed" },
    4: { buildId: 4, buildNumber: 4, state: "running"}
  },

  openedBuilds: {4:true}
}

const rootReducer = combineReducers({
  openedBuilds: ToggleBuildDetailsReducer,
  summaries:  BuildSummariesReducer
})


const appState = createStore(rootReducer, initialState, window.devToolsExtension && window.devToolsExtension());

export default appState;
