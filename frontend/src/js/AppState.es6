import {createStore, combineReducers} from 'redux';
import {ToggleBuildDetailsReducer} from './reducers/ToggleBuildDetails.es6';
import {BuildSummariesReducer, ADD_SUMMARY} from './reducers/BuildSummaries.es6';
import {changeBuildSummary} from './Actions.es6';
import {BuildDetailsReducer, ViewBuildStepReducer} from './reducers/BuildDetails.es6';
import {PipelineConfigurationReducer} from './reducers/PipelineConfiguration.es6';
import R from 'ramda';

const initialState = {
  summaries: {},
  openedBuilds: {},
  buildDetails: {},
  config: {name : "PIPELINE_NAME"},
};

const rootReducer = combineReducers({
  openedBuilds: ToggleBuildDetailsReducer,
  summaries:  BuildSummariesReducer,
  buildDetails: BuildDetailsReducer,
  config: PipelineConfigurationReducer,
  viewBuildSteps: ViewBuildStepReducer
});


const appState = createStore(rootReducer, initialState, window.devToolsExtension && window.devToolsExtension());

export default appState;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const runningBuildsDurationCounter = () => {
  let dispatch = () => {};

  const summaries = appState.getState().summaries;
  sleep(1000).then(()=>{
    R.compose(R.forEach(action => dispatch(action)), R.map(summary=>changeBuildSummary(summary.buildId, {duration: summary.duration+1})),R.filter(summary=>summary.state ==='running'))(R.values(summaries));
    runningBuildsDurationCounter(dispatch);
  });
};
runningBuildsDurationCounter(appState.dispatch);
