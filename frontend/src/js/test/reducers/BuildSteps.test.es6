/* globals describe it expect afterEach beforeEach */
import buildStepsReducer, {toggleState, showSubstepReducer} from "reducers/BuildSteps.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BuildStep", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("toggle State", () => {
        it("should add new entry with false if no stepId is available", () => {
            const oldState = {};
            const newState = toggleState(oldState, 1, "1");

            expect(newState).toEqual({1: {"1": true}});
        });

        it("should add new entry and don't change exist entries", () => {
            const oldState = {1: {"1": true}};
            const newState = toggleState(oldState, 2, "1");

            expect(newState).toEqual({1: {"1": true}, 2: {"1": true}});
        });

        it("should add new entry into existent build", () => {
            const oldState = {1: {"1": true}};
            const newState = toggleState(oldState, 1, "2");

            expect(newState).toEqual({1: {"1": true, "2": true}});
        });

        it("should toggle existent entry", () => {
            const oldState = {1: {"1": true}};

            const newState = toggleState(oldState, 1, "1");

            expect(newState).toEqual({1: {"1": false}});
        });
    });

    describe("BuildStepsReducer", () => {
        it("should return oldState if action not define", () => {
            const oldState = {};

            const newState = buildStepsReducer(oldState, {type: "SOME_OTHER_ACTION"});

            expect(newState).toBe(oldState);
        });
    });

    describe("ShowSubstepsReducer", () => {
        it("should return oldState if action not define", () => {
            const oldState = {};

            const newState = showSubstepReducer(oldState, {type: "SOME_OTHER_ACTION"});

            expect(newState).toBe(oldState);
        });

        it("should return state with value true", () => {
            const oldState = {};

            const newState = showSubstepReducer(oldState, {type: "openSubsteps", buildId: 1, stepId: "1"});

            expect(newState).toEqual({1: {"1": true}});
        });

        it("should not change value if it is true", () => {
            const oldState = {1: {"1": true}};

            const newState = showSubstepReducer(oldState, {type: "openSubsteps", buildId: 1, stepId: "1"});

            expect(newState).toBe(oldState);
        });

        it("should change value if it is false", () => {
            const oldState = {1: {"1": false}};

            const newState = showSubstepReducer(oldState, {type: "openSubsteps", buildId: 1, stepId: "1"});

            expect(newState).toEqual({1: {"1": true}});
        });
    });
});
