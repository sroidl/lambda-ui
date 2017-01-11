import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import {ToggleBuildDetailsReducer} from "./reducers/ToggleBuildDetails.es6";
import {BuildSummariesReducer} from "./reducers/BuildSummaries.es6";
import {BuildDetailsReducer, ScrollToStepReducer} from "./reducers/BuildDetails.es6";
import {PipelineConfigurationReducer} from "./reducers/PipelineConfiguration.es6";
import {OutputReducer} from "./reducers/Output.es6";
import {DevelopmentTogglesReducer} from "./reducers/DevelopmentToggles.es6";
import {buildStepsReducer, showSubstepReducer} from "./reducers/BuildSteps.es6";
import BuildStepTriggerReducer from "./reducers/BuildStepTrigger.es6";

const initialState = {
    summaries: {},
    openedBuilds: {},
    buildDetails: {},
    config: {name: "PIPELINE_NAME"},
    output: {showOutput: false},
    developmentToggles: {
        usePolling: true,
        showInterestingStep: false,
        showConnectionState: false,
        showPipelineTour: false,
        quickDetails_expandCollapse: false
    },
    showStepToolbox: {},
    triggerDialog: {},
    showSubsteps: {},
    scrollToStep: {},
};

const rootReducer = combineReducers({
    openedBuilds: ToggleBuildDetailsReducer,
    summaries: BuildSummariesReducer,
    buildDetails: BuildDetailsReducer,
    config: PipelineConfigurationReducer,
    output: OutputReducer,
    developmentToggles: DevelopmentTogglesReducer,
    showStepToolbox: buildStepsReducer,
    triggerDialog: BuildStepTriggerReducer,
    showSubsteps: showSubstepReducer,
    scrollToStep: ScrollToStepReducer,
});

const middleware = compose(
    applyMiddleware(ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

export const createLambdaUiStore = () => createStore(rootReducer, initialState, middleware);