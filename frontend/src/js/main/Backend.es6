/* globals Map */
import * as R from "ramda";
import {webSocket} from "./WebSocketFactory.es6";
import {addBuildDetails, addBuildSummary} from "./Actions.es6";
import {addBuildstepOutput, outputConnectionState} from "./actions/OutputActions";
import {summariesConnectionState} from "./actions/BackendActions.es6";

const CLOSED = 3;
const OPEN = 1;

const outputUrl = (baseUrl, buildId, stepId) => "ws://" + baseUrl + "/lambdaui/api/builds/" + buildId + "/" + stepId;
const detailsUrl = (baseUrl, buildId) => "ws://" + baseUrl + "/lambdaui/api/builds/" + buildId;
const summariesUrl = baseUrl => "ws://" + baseUrl + "/lambdaui/api/builds";
const triggerNewUrl = baseUrl => "http://" + baseUrl + "/lambdaui/api/triggerNew";

export class Backend {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.outputUrl = R.curry(outputUrl)(baseUrl);
        this.detailsUrl = R.curry(detailsUrl)(baseUrl);
        this.detailsConnections = new Map();
        this.summariesUrl = summariesUrl(baseUrl);
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
        /* eslint-disable */
        connection.onmessage = body => {
            const data = JSON.parse(body.data);
            const out = R.view(R.lensPath(["stepResult", "out"]))(data);
            if (out) {
                dispatch(addBuildstepOutput(buildId, stepId, data.stepResult.out.split("\n")));
            }
        };
        connection.onclose = () => dispatch(outputConnectionState("closed"));
        connection.onopen = () => dispatch(outputConnectionState("open"));
        connection.onerror = () => dispatch(outputConnectionState("error"));
    }

    requestDetails(dispatch, buildId) {
        if (this._hasOpenDetailsConnection(buildId)) {
            return;
        }

        const connection = webSocket(this.detailsUrl(buildId));
        this.detailsConnections.set(buildId, connection);

        connection.onmessage = body => {
            dispatch(addBuildDetails(buildId, JSON.parse(body.data)));
        };
    }

    closeDetailsConnection(buildId) {
        this._closeConnection(this.detailsConnections.get(buildId));
    }


    requestSummaries(dispatch) {
        const connection = webSocket(this.summariesUrl);
        connection.onclose = () => {
            dispatch(summariesConnectionState("closed"));
        };

        connection.onmessage = body => {
            const data = JSON.parse(body.data);
            dispatch(addBuildSummary(data.summaries));
        };

    }

    triggerNewBuild() {
        const fetchOptions = {
            method: "POST"
        };

        fetch(triggerNewUrl(this.baseUrl), fetchOptions);
    }

}
