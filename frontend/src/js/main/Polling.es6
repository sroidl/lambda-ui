import R from "ramda";
import * as Utils from "./Utils.es6";

const DELAY_MS = 1000;

export const pollBuildDetails = (backend, store) => {
    const state = store.getState().openedBuilds;
    const openedBuilds = R.pipe(R.keys, R.filter((key) => state[key]))(state);
    const requestDetails = buildId => backend.requestDetails(store.dispatch, buildId);

    R.forEach(requestDetails, openedBuilds);
    Utils.delay(DELAY_MS).then(() => pollBuildDetails(backend, store));
};

export const pollSummaries = (backend, store) => {
    backend.requestSummaries(store.dispatch);
    Utils.delay(DELAY_MS).then(() => pollSummaries(backend, store));
};