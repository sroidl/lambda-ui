/* globals describe it expect */
import buildStepsReducer, {ParallelStepsReducer, toggleState} from "reducers/BuildSteps.es6";
import {TOGGLE_STEP_TOOLBOX, TOGGLE_PARALLEL_STEP} from "actions/BuildStepActions.es6";

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

describe("ParallelStepReducer", () => {
    it("should return oldState if action not define", () => {
        const oldState = {};

        const newState = ParallelStepsReducer(oldState, {type: "SOME_OTHER_ACTION"});

        expect(newState).toBe(oldState);
    });
});