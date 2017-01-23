/* globals describe it expect afterEach beforeEach jest */
jest.mock("../../main/steps/InterestingStepFinder.es6");
jest.mock("../../main/DevToggles.es6");
import {toggleState, showSubstepReducer, buildStepsReducer} from "../../main/reducers/BuildSteps.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {findPathToMostInterestingStep} from "../../main/steps/InterestingStepFinder.es6";
import devToggles from "../../main/DevToggles.es6";
import * as OutputActions from "../../main/actions/OutputActions.es6";
import * as BuildDetailActions from "../../main/actions/BuildDetailActions.es6";

devToggles.followBuild = true;

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

            expect(newState).toEqual({1: {"1": true, follow: false}});
            expect(newState).not.toBe(oldState);
        });

        it("should add new entry and don't change exist entries", () => {
            const oldState = {1: {"1": true}};
            const newState = toggleState(oldState, 2, "1");

            expect(newState).toEqual({1: {"1": true}, 2: {"1": true, follow: false}});
            expect(newState).not.toBe(oldState);
        });

        it("should add new entry into existent build", () => {
            const oldState = {1: {"1": true}};
            const newState = toggleState(oldState, 1, "2");

            expect(newState).toEqual({1: {"1": true, "2": true, follow: false}});
            expect(newState).not.toBe(oldState);
        });

        it("should toggle existent entry", () => {
            const oldState = {1: {"1": true}};

            const newState = toggleState(oldState, 1, "1");

            expect(newState).toEqual({1: {"1": false, follow: false}});
            expect(newState).not.toBe(oldState);
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

            expect(newState).toEqual({1: {"1": true, follow: false}});
            expect(newState).not.toBe(oldState);

        });

        it("should change value if it is false", () => {
            const oldState = {1: {"1": false}};

            const newState = showSubstepReducer(oldState, {type: "openSubsteps", buildId: 1, stepId: "1"});

            expect(newState).toEqual({1: {"1": true, follow: false}});
            expect(newState).not.toBe(oldState);

        });
    });

    describe("CloseSubstep", () => {
        it("should return oldState if action is not defined", () => {
            const oldState = {};

            const newState = showSubstepReducer(oldState, {type: "SOME_OTHER_ACTION"});

            expect(newState).toBe(oldState);
        });

        it("should return state with value false", () => {
            const oldState = {};

            const newState = showSubstepReducer(oldState, {type: "closeSubstep", buildId: 1, stepId: "1"});

            expect(newState).toEqual({1: {"1": false, follow: false}});
            expect(newState).not.toBe(oldState);

        });

        it("should change value if it is false", () => {
            const oldState = {1: {"1": true}};

            const newState = showSubstepReducer(oldState, {type: "closeSubstep", buildId: 1, stepId: "1"});

            expect(newState).toEqual({1: {"1": false, follow: false}});
            expect(newState).not.toBe(oldState);

        });
    });

    describe("AddBuildDetails", () => {
        it("should return oldState if action is not defined", () => {
            const oldState = {};

            const newState = showSubstepReducer(oldState, {type: "SOME_OTHER_ACTION"});

            expect(newState).toBe(oldState);
        });

        it("should open most interesting step", () => {
            const oldState = {42: {"1": false, "follow": true}, 1: {"1": true}};
            findPathToMostInterestingStep.mockReturnValue({state: "running", path: ["1", "1-1", "1-1-1"]});

            const newState = showSubstepReducer(oldState, {
                type: "addBuildDetails",
                buildId: 42,
                buildDetails: {foo: "bar"}
            });

            expect(findPathToMostInterestingStep).toBeCalledWith({foo: "bar"}, "root");
            expect(newState).toEqual({42: {"1": true, "1-1": true, "1-1-1": true, "follow": true}, 1: {"1": true}});
        });

        it("should not open most interesting step if follow is false", () => {
            const oldState = {42: {"1": false, follow: false}, 1: {"1": true, follow: false}};
            findPathToMostInterestingStep.mockReturnValue({state: "running", path: ["1", "1-1", "1-1-1"]});

            const newState = showSubstepReducer(oldState, {
                type: "addBuildDetails",
                buildId: 42,
                buildDetails: {foo: "bar"}
            });

            expect(findPathToMostInterestingStep).toBeCalledWith({foo: "bar"}, "root");
            expect(newState).toEqual(oldState);
        });
    });

    describe("toggleFollow", () => {
        it("should add follow flag", () => {
            const oldState = {42: {"1": false}, 1: {"1": true}};

            const newState = showSubstepReducer(oldState, {
                type: "toggleFollow",
                buildId: 42
            });

            expect(newState).toEqual({42: {"1": false, follow: false}, 1: {"1": true}});
        });

        it("should toggle follow flag", () => {
            const oldState = {42: {"1": false, follow: true}, 1: {"1": true}};

            const newState = showSubstepReducer(oldState, {
                type: "toggleFollow",
                buildId: 42
            });

            expect(newState).toEqual({42: {"1": false, follow: false}, 1: {"1": true}});
        });

        it("should disable follow on showOutput", () => {
            const oldState = {1: {follow: true}};

            const newState = showSubstepReducer(oldState,OutputActions.showBuildOutput(1, "1"));

            expect(newState).toEqual({1: {follow: false}});
            expect(newState).not.toBe(oldState);
        });
    });

    describe("show scroll info", () => {

        it("should set scrollInfo to false", () => {
            const oldState = {
                12: {
                    showScrollInfo: false,
                    other: "values"
                }
            };

            const newState = showSubstepReducer(oldState, BuildDetailActions.showScrollInfo(12, true));

            expect(newState).toEqual({12: {showScrollInfo: true, other: "values"}});
        });

    });
});
