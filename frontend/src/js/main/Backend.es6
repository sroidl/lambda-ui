import "whatwg-fetch";
import {webSocket} from "./WebSocketFactory.es6";
import * as R from "ramda";
import {addBuildSummary, addBuildDetails, addBuildstepOutput} from "./Actions.es6";

export const receiveBuildSummaries = (dispatch) => {
  const endpoint = "http://localhost:8081/lambdaui/api/summaries";

  fetch(endpoint)
    .then(response => response.json())
    .then(body => dispatch(addBuildSummary(body.summaries)));

};

export const requestBuildDetails = (dispatch, buildId) => {
  const endpoint = "http://localhost:8081/lambdaui/api/builds/" + buildId;

  fetch(endpoint)
    .then(response => response.json())
    .then(body => dispatch(addBuildDetails(body)));

};


class OutputWebSocket {

  getConnectionFor(url) {
    const CLOSED = 3;
    const isOpen = readyState => readyState !== CLOSED;

    if (this.websocket && isOpen(this.websocket.readyState)) {
      this.websocket.close();
    }

    this.websocket = webSocket(url);

    return this.websocket;
  }

  requestOutput(dispatch, baseUrl) {
    return (buildId, stepId) => {

      const endpoint = "ws://" + baseUrl + "/lambdaui/api/builds/" + buildId + "/" + stepId;
      const ws = this.getConnectionFor(endpoint);

      ws.onopen = () => dispatch({type: "outputConnectionState", state: "open"});
      ws.onclose = () => dispatch({type: "outputConnectionState", state: "closed"});
      ws.onerror = () => dispatch({type: "outputConnectionState", state: "error"});
      ws.onmessage = body => {
        const data = JSON.parse(body.data);
        const out = R.view(R.lensPath(["stepResult", "out"]))(data);
        if(out) {
          dispatch(addBuildstepOutput(buildId, stepId, data.stepResult.out.split("\n")));
        }
      };
    };
  }
}

export const outputConnection = new OutputWebSocket();

export default {receiveBuildSummaries, requestBuildDetails};
