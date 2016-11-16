/* globals describe it expect */
import buildStepsReducer from "reducers/BuildSteps.es6";
import {TOGGLE_STEP_TOOLBOX} from "actions/BuildStepActions.es6";

describe("BuildStepsReducer", () => {
    it("should add new entry with false if no stepId is available", () => {
        const oldState = {};
        const newState = buildStepsReducer(oldState, {type: TOGGLE_STEP_TOOLBOX, buildId: 1, stepId: "1"});

        expect(newState).toEqual({1:{"1":true}});
    });
    it("should add new entry and don't change exist entries", () => {
        const oldState = {1: {"1": true}};
        const newState = buildStepsReducer(oldState, {type: TOGGLE_STEP_TOOLBOX, buildId: 2, stepId: "1"});

        expect(newState).toEqual({1:{"1":true}, 2:{"1":true}});
    });
    it("should add new entry into existent build", () => {
        const oldState = {1: {"1": true}};
        const newState = buildStepsReducer(oldState, {type: TOGGLE_STEP_TOOLBOX, buildId: 1, stepId: "2"});

        expect(newState).toEqual({1: {"1":true, "2":true}});
    });
    it("should toggle existent entry", () => {
        const oldState = {1: {"1": true}};

        const newState = buildStepsReducer(oldState, {type: TOGGLE_STEP_TOOLBOX, buildId: 1, stepId: "1"});

        expect(newState).toEqual({1: {"1":false}});
    });
});