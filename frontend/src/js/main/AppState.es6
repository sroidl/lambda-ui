import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import {ToggleBuildDetailsReducer} from "./reducers/ToggleBuildDetails.es6";
import {BuildSummariesReducer} from "./reducers/BuildSummaries.es6";
import {BuildDetailsReducer, ViewBuildStepReducer} from "./reducers/BuildDetails.es6";
import {PipelineConfigurationReducer} from "./reducers/PipelineConfiguration.es6";
import {OutputReducer} from "./reducers/Output.es6";
import {DevelopmentTogglesReducer} from "./reducers/DevelopmentToggles.es6";
import BuildStepsReducer, {ParallelStepsReducer} from "./reducers/BuildSteps.es6";
import BuildDetailBreadcrumbReducer from "reducers/BuildDetailBreadcrumb.es6";


const initialState = {
    summaries: {},
    openedBuilds: {},
    buildDetails: {},
    config: {name: "PIPELINE_NAME", baseUrl: "localhost:8081"},
    viewBuidSteps: {},
    output: {showOutput: false},
    developmentToggles: { usePolling : true, showInterestingStep: false, showParallelStepsDirectly: false },
    showStepToolbox: {},
    showInParallel: {},
    showParentStepBreadcrumb: {}
};

const rootReducer = combineReducers({
    openedBuilds: ToggleBuildDetailsReducer,
    summaries: BuildSummariesReducer,
    buildDetails: BuildDetailsReducer,
    config: PipelineConfigurationReducer,
    viewBuildSteps: ViewBuildStepReducer,
    output: OutputReducer,
    developmentToggles: DevelopmentTogglesReducer,
    showStepToolbox: BuildStepsReducer,
    showInParallel: ParallelStepsReducer,
    showParentStepBreadcrumb: BuildDetailBreadcrumbReducer
});

const middleware = compose(
    applyMiddleware(ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

export const createLambdaUiStore = () => createStore(rootReducer, initialState, middleware);


