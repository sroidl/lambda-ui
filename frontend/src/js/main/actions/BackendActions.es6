import LambdaUI from "../App.es6";
import R from "ramda";
import {delay} from "Utils.es6";

export const OUTPUT_CONNECTION_STATE = "outputConnectionState";
export const SUMMARIES_CONNECTION_STATE = "summariesConnectionState";



export const requestOutput = (buildId, stepId) =>
    dispatch => {
        const backend = LambdaUI.backend();
        return backend.requestOutput(dispatch, buildId, stepId);
    };

export const requestDetails = buildId =>
    dispatch => {
        const backend = LambdaUI.backend();
        backend.requestDetails(dispatch, buildId);
    };

export const requestDetailsPolling = (buildId) =>
    dispatch => {
        // TODO : how to test this properly?
        const store = LambdaUI.appStore();
        dispatch(requestDetails(buildId));
        delay(1000).then(() => {
            /* eslint-disable */
            const state = store.getState();
            const isOpen = R.view(R.lensPath(["openedBuilds", buildId]), state);
            const stateLens = R.lensPath(["summaries", buildId, "state"]);
            const isRunning = R.view(stateLens, state) === "running";
            const isWaiting = R.view(stateLens, state) === "waiting";

            if (!!isOpen && (!!isRunning || !!isWaiting)) {
                dispatch(requestDetailsPolling(buildId));
            }
        });
    };


export const requestSummariesPolling = () =>
    dispatch => {
        // TODO : how to test this properly?
        const backend = LambdaUI.backend();
        backend.requestSummaries(dispatch);
        setTimeout(() => dispatch(requestSummariesPolling()), 1000);
    };

export const outputConnectionInfo = (state) => {
    return {type: OUTPUT_CONNECTION_STATE, state: state};
};


export const summariesConnectionState = state => {
    return {type: SUMMARIES_CONNECTION_STATE, state: state};
};
