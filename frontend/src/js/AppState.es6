import { createStore, combineReducers } from 'redux'
import {ToggleBuildDetailsReducer} from './reducers/ToggleBuildDetails.es6'
import { BuildSummariesReducer, ADD_SUMMARY } from './reducers/BuildSummaries.es6'

const initialState = {
  summaries: {
  },

  openedBuilds: {4:true}
}

const rootReducer = combineReducers({
  openedBuilds: ToggleBuildDetailsReducer,
  summaries:  BuildSummariesReducer
})


const appState = createStore(rootReducer, initialState, window.devToolsExtension && window.devToolsExtension());

export default appState;
