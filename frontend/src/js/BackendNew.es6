/* eslint-disable */
import * as R from "ramda";
import {webSocket} from "./WebSocketFactory.es6";
import {addBuildstepOutput} from "./Actions.es6";

const outputUrl = (baseUrl, buildId, stepId) => "ws://" + baseUrl + "/builds/" + buildId + "/" + stepId;

export class Backend {
    constructor({baseUrl}) {
        this.baseUrl = baseUrl;
        this.outputUrl = R.curry(outputUrl)(baseUrl);
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
    };

}
