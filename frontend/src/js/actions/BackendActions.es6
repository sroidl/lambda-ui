import LambdaUI from "../App.es6";
export const OUTPUT_CONNECTION_STATE = "outputConnectionState";


export const requestOutput = (buildId, stepId) =>
  dispatch => {
    const backend = LambdaUI.backend();
    return backend.requestOutput(dispatch, buildId, stepId);
   };

export const outputConnectionInfo = (state) => {
  return {type: OUTPUT_CONNECTION_STATE, state: state};
};
