/* globals Map */
/* eslint-disable */
import * as R from "ramda";
import {webSocket} from "WebSocketFactory.es6";
import {addBuildSummary} from "actions/BuildSummaryActions.es6";
import {addBuildstepOutput, outputConnectionState} from "actions/OutputActions.es6";
import {summariesConnectionState} from "actions/BackendActions.es6";
import {addBuildDetails} from "actions/BuildDetailActions.es6";

const CLOSED = 3;
const OPEN = 1;

const outputUrl = (baseUrl, buildId, stepId) => "ws://" + baseUrl + "/lambdaui/api/builds/" + buildId + "/" + stepId;
const detailsUrl = (baseUrl, buildId) => "ws://" + baseUrl + "/lambdaui/api/builds/" + buildId;
const summariesUrl = baseUrl => "http://" + baseUrl + "/lambdaui/api/builds";
const triggerNewUrl = baseUrl => "http://" + baseUrl + "/lambdaui/api/triggerNew";


const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve()), ms);

export class BackendPolling {

    constructor(baseUrl, store) {
        this.baseUrl = baseUrl;
        this.outputUrl = R.curry(outputUrl)(baseUrl);
        this.detailsUrl = R.curry(detailsUrl)(baseUrl);
        this.summariesUrl = summariesUrl(baseUrl);
        this.store = store;
    }

    requestOutput(dispatch, buildId, stepId) {

    }

    requestDetails(dispatch, buildId) {

    }

    closeDetailsConnection(buildId) {

    }

    requestSummaries() {
        fetch(this.summariesUrl)
            .then(response => response.json())
            .then(body => this.store.dispatch(addBuildSummary(body.summaries)))
    }

    triggerNewBuild() {
        fetch(triggerNewUrl(this.baseUrl), { method: "POST"});
    }




    triggerStep(url, body) {
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: body
        };

        fetch(url, fetchOptions).catch((error) => {
            console.error("Request failed: " , error);
        });
    }
}
