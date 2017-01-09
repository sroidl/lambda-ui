import R from "ramda";
import * as Utils from "./Utils.es6";

const DELAY_MS = 1000;

const callRequestDetails = (backend, dispatchFn) => {
    const innerFn =  (buildId) => {
        backend.requestDetails(dispatchFn, buildId);
    };
    return innerFn;
};

export const polling = (backend, store) => {
    const state = store.getState().openedBuilds;
    const openedBuilds = R.pipe(R.keys, R.filter((key) => state[key]))(state);
    const requestDetails = callRequestDetails(backend, store.dispatch);
    R.forEach(requestDetails, openedBuilds);

    Utils.delay(DELAY_MS).then(() => polling(backend, store));
};


