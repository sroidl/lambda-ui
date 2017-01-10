import LambdaUI from "../App.es6";

export const OUTPUT_CONNECTION_STATE = "outputConnectionState";
export const SUMMARIES_CONNECTION_STATE = "summariesConnectionState";
export const KILL_STEP = "killStep";


export const requestOutput = (buildId, stepId) =>
    dispatch => {
        const backend = LambdaUI.backend();
        return backend.requestOutput(dispatch, buildId, stepId);
    };

export const outputConnectionInfo = (state) => {
    return {type: OUTPUT_CONNECTION_STATE, state: state};
};


export const summariesConnectionState = state => {
    return {type: SUMMARIES_CONNECTION_STATE, state: state};
};
