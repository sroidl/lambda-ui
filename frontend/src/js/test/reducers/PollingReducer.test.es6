/* global describe it expect  */
import * as subject from "reducers/PollingReducer.es6";
import {POLLING_BUILD_DETAILS} from "actions/BackendActions.es6";
import R from "ramda";

describe("PollingReducer", () => {

    it("should return oldState if other action type", () => {
        const oldState = {};

        const actual = subject.pollingReducer(oldState, {type: "OTHER_ACTION"});

        expect(actual).toBe(oldState);
    });

    it("should set value to true for polling action", () => {
        const oldState = {};

        const actual = subject.pollingReducer(oldState, {type: POLLING_BUILD_DETAILS, buildId: 1, active: true});

        expect(actual).not.toBe(oldState);

        expect(actual).toEqual({  1:  true});
    });

    it("should set value to false for polling action", () => {
        const oldState = {};

        const actual = subject.pollingReducer(oldState, {type: POLLING_BUILD_DETAILS, buildId: 1, active: false});

        expect(actual).not.toBe(oldState);

        expect(actual).toEqual({ 1: false});
    });

    it("should set value to false for polling action", () => {
        const oldState = {2: true};

        const actual = subject.pollingReducer(oldState, {type: POLLING_BUILD_DETAILS, buildId: 1, active: false});

        expect(actual).not.toBe(oldState);

        expect(actual).toEqual({ 1 : false, 2: true});
    });

});
