/* globals describe it expect beforeEach afterEach */
import {getStateForFavicon} from "FaviconState.es6";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

describe("getStateForFavivon", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return null if state is emty", () => {
        const newState = {};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual(null);
    });

    it("should return first state if state has one element", () => {
        const newState = {1: {state: "success"}};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual("success");
    });

    it("should return last state of summaries", () => {
        const newState = {1: {state: "success"}, 2: {state: "failure"}};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual("failure");
    });

    it("should return highest state of summaries", () => {
        const newState = {1: {state: "success"}, 3: {state: "failure"}, 2: {state: "running"}};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual("failure");
    });
});