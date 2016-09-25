/* globals Map */
import * as R from "ramda";
import {webSocket} from "./WebSocketFactory.es6";
import {addBuildstepOutput, outputConnectionState, addBuildDetails} from "./Actions.es6";

const CLOSED = 3;
const OPEN = 1;

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

      if (websocket && websocket.readystate !== CLOSED) {
        websocket.close();
      }
    }

    _hasOpenDetailsConnection(buildId) {
      const connection = this.detailsConnections.get(buildId);
      return connection && connection.readystate === OPEN;
    }

    requestOutput(dispatch, buildId, stepId) {
      this._closeConnection(this.outputConnection);
      this.outputConnection = webSocket(this.outputUrl(buildId, stepId));
      const connection = this.outputConnection;
      connection.onmessage = body => dispatch(addBuildstepOutput(buildId, stepId, JSON.parse(body)));
      connection.onclose = () => dispatch(outputConnectionState("closed"));
      connection.onopen = () => dispatch(outputConnectionState("open"));
      connection.onerror = () => dispatch(outputConnectionState("error"));
    }

    requestDetails(dispatch, buildId) {
      if(this._hasOpenDetailsConnection(buildId)) {
        return;
      }

      const connection = webSocket(this.detailsUrl(buildId));
      this.detailsConnections.set(buildId, connection);

      connection.onmessage = body => dispatch(addBuildDetails(buildId, JSON.parse(body)));
    }

    closeDetailsConnection(buildId) {
      this._closeConnection(this.detailsConnections.get(buildId));
    }

}
