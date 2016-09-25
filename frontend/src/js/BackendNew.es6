/* eslint-disable */
import * as R from "ramda";
import {webSocket} from "./WebSocketFactory.es6";
import {addBuildstepOutput, outputConnectionState, addBuildDetails} from "./Actions.es6";


const outputUrl = (baseUrl, buildId, stepId) => "ws://" + baseUrl + "/lambdaui/api/builds/" + buildId + "/" + stepId;
const detailsUrl = (baseUrl, buildId) => "ws://" +baseUrl + "/lambdaui/api/builds/" + buildId;

export class Backend {
    constructor({baseUrl}) {
        this.baseUrl = baseUrl;
        this.outputUrl = R.curry(outputUrl)(baseUrl);
        this.detailsUrl = R.curry(detailsUrl)(baseUrl);
        this.detailsConnections = new Map();
    }

    _closeConnection(websocket) {
      const CLOSED = 3;
      if (websocket && websocket.readystate !== CLOSED) {
        websocket.close();
      }
    }

    requestOutput(dispatch, buildId, stepId) {
      this._closeConnection(this.outputConnection);
      this.outputConnection = webSocket(this.outputUrl(buildId, stepId));
      const connection = this.outputConnection;
      connection.onmessage = body => dispatch(addBuildstepOutput(buildId, stepId, JSON.parse(body)));
      connection.onclose = () => dispatch(outputConnectionState("closed"));
      connection.onopen = () => dispatch(outputConnectionState("open"));
      connection.onerror = () => dispatch(outputConnectionState("error"));
    };

    requestDetails(dispatch, buildId) {
      this.detailsConnection = webSocket(this.detailsUrl(buildId));
      const connection = this.detailsConnection;
      connection.onmessage = body => dispatch(addBuildDetails(buildId, JSON.parse(body)));
    }

    closeDetailsConnection() {
      this._closeConnection(this.detailsConnection);
    }

}
