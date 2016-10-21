import LambdaUI from "../App.es6";
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

export const requestSummariesPolling = () =>
  dispatch => {
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
