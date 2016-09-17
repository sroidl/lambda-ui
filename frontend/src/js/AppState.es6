/* global Promise */
import {createStore, combineReducers} from "redux";
import {ToggleBuildDetailsReducer} from "./reducers/ToggleBuildDetails.es6";
import {BuildSummariesReducer} from "./reducers/BuildSummaries.es6";
import {changeBuildSummary} from "./Actions.es6";
import {BuildDetailsReducer, ViewBuildStepReducer} from "./reducers/BuildDetails.es6";
import {PipelineConfigurationReducer} from "./reducers/PipelineConfiguration.es6";
import {OutputReducer} from "./reducers/Output.es6";
import R from "ramda";

const initialState = {
  summaries: {},
  openedBuilds: {1 : true},
  buildDetails: {},
  config: {name : "PIPELINE_NAME"},
  output: {showOutput: true, buildId: 1, stepId: 1}
};

const rootReducer = combineReducers({
  openedBuilds: ToggleBuildDetailsReducer,
  summaries:  BuildSummariesReducer,
  buildDetails: BuildDetailsReducer,
  config: PipelineConfigurationReducer,
  viewBuildSteps: ViewBuildStepReducer,
  output: OutputReducer
});


const appState = createStore(rootReducer, initialState, window.devToolsExtension && window.devToolsExtension());

export default appState;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const runningBuildsDurationCounter = () => {
  const dispatch = () => {};

  const summaries = appState.getState().summaries;
  sleep(1000).then(() => {
    R.compose(R.forEach(action => dispatch(action)), R.map(summary => changeBuildSummary(summary.buildId, {duration: summary.duration+1})),R.filter(summary => summary.state ==="running"))(R.values(summaries));
    runningBuildsDurationCounter(dispatch);
  });
};
runningBuildsDurationCounter(appState.dispatch);
