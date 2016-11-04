import LambdaUI from "../App.es6";
import R from "ramda";
import * as Utils from "Utils.es6";

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
        const store = LambdaUI.appStore();
        dispatch(requestDetails(buildId));
        Utils.delay(1000).then(() => {
            const state = store.getState();
            const isOpen = R.pathOr(false, ["openedBuilds", buildId])(state);
            const build = R.path(["buildDetails", buildId])(state);

            if (isOpen && Utils.isBuildRunning(build)) {
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
