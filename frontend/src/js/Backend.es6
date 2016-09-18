/* eslint-disable */
import "whatwg-fetch";
import {addBuildSummary, addBuildDetails, addBuildstepOutput} from "./Actions.es6";

export const receiveBuildSummaries = (dispatch) => {
  const endpoint = "http://localhost:8081/lambdaui/api/summaries";

  fetch(endpoint)
    .then(response => response.json())
    .then(body => dispatch(addBuildSummary(body.summaries)))

};

export const requestBuildDetails = (dispatch, buildId) => {
  const endpoint = "http://localhost:8081/lambdaui/api/builds/" + buildId;

  fetch(endpoint)
    .then(response => response.json())
    .then(body => dispatch(addBuildDetails(body)))
    
};

export const requestOutput = dispatch => (buildId, stepId) => {

  const endpoint = "ws://localhost:8081/lambdaui/api/builds/" + buildId + "/" + stepId;

  const ws = new WebSocket(endpoint);
  ws.onopen = () => dispatch({type: "outputConnectionState", state: "open"});
  ws.onclose = () => dispatch({type: "outputConnectionState", state: "closed"});
  ws.onerror = () => dispatch({type: "outputConnectionState", state: "error"});
  ws.onmessage = body => {
    const data = JSON.parse(body.data)
    if(data.stepResult !== null && data.stepResult.out) {
      dispatch(addBuildstepOutput(buildId, stepId, data.stepResult.out))
    }
  };
};

export default {receiveBuildSummaries, requestBuildDetails, requestOutput};
