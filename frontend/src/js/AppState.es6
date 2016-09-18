import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import {ToggleBuildDetailsReducer} from "./reducers/ToggleBuildDetails.es6";
import {BuildSummariesReducer} from "./reducers/BuildSummaries.es6";
import {BuildDetailsReducer, ViewBuildStepReducer} from "./reducers/BuildDetails.es6";
import {PipelineConfigurationReducer} from "./reducers/PipelineConfiguration.es6";
import {OutputReducer} from "./reducers/Output.es6";

const initialState = {
  summaries: {},
  openedBuilds: {},
  buildDetails: {},
  config: {name : "PIPELINE_NAME", baseUrl: "localhost:8081"},
  output: {showOutput: false}
};

const rootReducer = combineReducers({
  openedBuilds: ToggleBuildDetailsReducer,
  summaries:  BuildSummariesReducer,
  buildDetails: BuildDetailsReducer,
  config: PipelineConfigurationReducer,
  viewBuildSteps: ViewBuildStepReducer,
  output: OutputReducer
});

const middleware = compose(
    applyMiddleware(ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

const appState = createStore(rootReducer, initialState,  middleware);

export default appState;
