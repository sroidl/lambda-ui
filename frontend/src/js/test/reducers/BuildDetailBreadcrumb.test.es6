/* globals describe it expect */
import BuildDetailBreadcrumbReducer, {toggleState} from "reducers/BuildDetailBreadcrumb.es6";
import {TOGGLE_PARENT_STEPS} from "actions/BuildDetailBreadcrumbActions.es6";

describe("toggleState", () => {
    it("should add new entry if no entry is available", () => {
        const oldState = {};

        const newState = toggleState(oldState, 1);

        expect(newState).toEqual({1: true});
    });

    it("should toggle existing entry by true", () => {
        const oldState = {1: false};

        const newState = toggleState(oldState, 1);

        expect(newState).toEqual({1: true});
    });

    it("should toggle existing entry by false", () => {
        const oldState = {1: true};

        const newState = toggleState(oldState, 1);

        expect(newState).toEqual({1: false});
    });

    it("should not change other entries", () => {
        const oldState = {1: true};

        const newState = toggleState(oldState, 2);

        expect(newState).toEqual({1: true, 2: true});
    });
});

describe("BuilDetailBreadcrumbReducer", () => {
    it("should return old state if action type is invalid", () => {
        const oldState = {};

        expect(BuildDetailBreadcrumbReducer(oldState, {type: "SOME_OTHER_ACTION"})).toBe(oldState);
    });

    it("should return other state if action type is valid", () => {
        const oldState = {};

        expect(BuildDetailBreadcrumbReducer(oldState, {type: TOGGLE_PARENT_STEPS, buildId: 1})).not.toBe(oldState);
    });
});
