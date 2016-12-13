/* globals describe it expect afterEach beforeEach */
import {BuildDetailsReducer as subject, ScrollToStepReducer} from "reducers/BuildDetails.es6";
import {ADD_BUILD_DETAILS, SCROLL_TO_STEP, NO_SCROLL_TO_STEP} from "actions/BuildDetailActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BuildDetails", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("BuildDetailReducer", () => {
        it("should return oldState if no ADD_BUILD_DETAILS action was emitted", () => {
            const oldState = {};

            const newState = subject(oldState, {type: "nonsense"});

            expect(newState).toBe(oldState);
        });
        it("should add a new detail entry if ADD_BUILD_DETAILS was emitted", () => {
            const oldState = {1: {bar: "foo"}};

            const newState = subject(oldState, {type: ADD_BUILD_DETAILS, buildId: 42, buildDetails: {foo: "bar"}});

            expect(newState).toEqual({1: {bar: "foo"}, 42: {foo: "bar"}});
        });
    });

    describe("ScrollToStepReducer", () => {
        it("should return oldState if no action was emitted", () => {
            const oldState = {};

            const newState = ScrollToStepReducer(oldState, {type: "nonsense"});

            expect(newState).toBe(oldState);
        });

        it("should add new scrollToStep entry", () => {
            const oldState = {};

            const newState = ScrollToStepReducer(oldState, {type: SCROLL_TO_STEP, buildId: 1, stepId: "1"});

            expect(newState).toEqual({scrollToStep: true, buildId: 1, stepId: "1"});
        });

        it("should change scrollToStep entry to false", () => {
            const oldState = {scrollToStep: true, buildId: 1, stepId: "1"};

            const newState = ScrollToStepReducer(oldState, {type: NO_SCROLL_TO_STEP});

            expect(newState).toEqual({scrollToStep: false, buildId: 1, stepId: "1"});
        });
    });
});