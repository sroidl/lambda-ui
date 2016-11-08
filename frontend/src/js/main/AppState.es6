import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import {ToggleBuildDetailsReducer} from "./reducers/ToggleBuildDetails.es6";
import {BuildSummariesReducer} from "./reducers/BuildSummaries.es6";
import {BuildDetailsReducer, ViewBuildStepReducer} from "./reducers/BuildDetails.es6";
import {PipelineConfigurationReducer} from "./reducers/PipelineConfiguration.es6";
import {OutputReducer} from "./reducers/Output.es6";

/* eslint-disable */




//TODO sr -- remove after proper integration of parallel steps

const initialStateWithParallelSummaries = {
    "100": {
        buildNumber: "IN-PARALLEL",
        buildId: 100,
        state: "success",
        startTime: "2016-11-07T15:49:50.117Z",
        endTime: "2016-11-07T15:50:11.123Z"
    }
};

const initialstateWithParallelDetails = {
    "100": {
        "buildId": "100",
        "steps": [
            {
                "stepId": "1",
                "name": "a-lot-output",
                "state": "success",
                "startTime": "2016-11-07T15:49:06.657Z",
                "endTime": "2016-11-07T15:49:06.919Z",
                "parentId": "root"
            },

            {
                "stepId": "3",
                "name": "in-parallel",
                "type": "parallel",
                "state": "success",
                "startTime": "2016-11-07T15:49:08.198Z",
                "endTime": "2016-11-07T15:49:50.102Z",
                "steps": [
                    {
                        "stepId": "1-1-3",
                        "name": "double-long",
                        "state": "success",
                        "startTime": "2016-11-07T15:49:08.223Z",
                        "endTime": "2016-11-07T15:49:50.057Z",
                        "steps": [
                            {
                                "stepId": "1-1-1-3",
                                "name": "long-running-task-20s",
                                "state": "success",
                                "startTime": "2016-11-07T15:49:08.260Z",
                                "endTime": "2016-11-07T15:49:28.906Z",
                                "parentId": "1-1-3"
                            },
                            {
                                "stepId": "2-1-1-3",
                                "name": "long-running-task-20s",
                                "state": "success",
                                "startTime": "2016-11-07T15:49:28.958Z",
                                "endTime": "2016-11-07T15:49:50.034Z",
                                "parentId": "1-1-3"
                            }
                        ],
                        "parentId": "3"
                    },
                    {
                        "stepId": "2-3",
                        "name": "long-running-task-20s",
                        "state": "success",
                        "startTime": "2016-11-07T15:49:08.232Z",
                        "endTime": "2016-11-07T15:49:28.927Z",
                        "parentId": "3"
                    },
                    {
                        "stepId": "3-3",
                        "name": "long-running-task-20s",
                        "state": "success",
                        "startTime": "2016-11-07T15:49:08.240Z",
                        "endTime": "2016-11-07T15:49:28.918Z",
                        "parentId": "3"
                    }
                ],
                "parentId": "root"
            },
            {
                "stepId": "4",
                "name": "long-running-task-20s",
                "state": "success",
                "startTime": "2016-11-07T15:49:50.117Z",
                "endTime": "2016-11-07T15:50:11.123Z",
                "parentId": "root"
            }
        ]
    }
};


const initialState = {
    summaries: initialStateWithParallelSummaries,
    openedBuilds: {},
    buildDetails: initialstateWithParallelDetails,
    config: {name: "PIPELINE_NAME", baseUrl: "localhost:8081"},
    output: {showOutput: false}
};

const rootReducer = combineReducers({
    openedBuilds: ToggleBuildDetailsReducer,
    summaries: BuildSummariesReducer,
    buildDetails: BuildDetailsReducer,
    config: PipelineConfigurationReducer,
    viewBuildSteps: ViewBuildStepReducer,
    output: OutputReducer
});

const middleware = compose(
    applyMiddleware(ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

export const createLambdaUiStore = () => createStore(rootReducer, initialState, middleware);


