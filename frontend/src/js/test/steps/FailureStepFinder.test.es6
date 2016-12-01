/* globals describe expect it xit beforeEach afterEach */
import {findParentOfFailedSubstep} from "steps/FailureStepFinder.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("Find failed Substep", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return current step if it has failed and no substeps", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    parentId: "root",
                    steps: []
                }]
            }}
        };
        expect(findParentOfFailedSubstep(state, 1, "1")).toEqual("root");
    });
    it("should return null if it is success", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "success",
                    parentId: "root",
                    steps: []
                }]
            }}
        };

        expect(findParentOfFailedSubstep(state, 1, "1")).toEqual(null);
    });

    it("should return children step if it failed", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    parentId: "root",
                    steps: [
                        {
                            stepId: "1-1",
                            state: "success",
                            parentId: "1",
                            steps: []
                        },

                        {
                            stepId: "1-2",
                            state: "failure",
                            parentId: "1",
                            steps: []
                        }]
                }]
            }}
        };

        expect(findParentOfFailedSubstep(state, 1, "1")).toEqual("1");
    });

    it("should return children children step if it failed", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    parentId: "root",
                    steps: [{
                        stepId: "1-1",
                        state: "failure",
                        parentId: "1",
                        steps: [{
                            stepId: "1-1-1",
                            state: "failure",
                            parentId: "1-1",
                            steps: []
                        }]
                    }]
                }]
            }}
        };

        expect(findParentOfFailedSubstep(state, 1, "1")).toEqual("1-1");
    });

    it("should return lowermost children step if it failed", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    parentId: "root",
                    steps: [{
                        stepId: "1-1",
                        state: "failure",
                        parentId: "1",
                        steps: [{
                            stepId: "1-1-1",
                            state: "failure",
                            parentId: "1-1",
                            steps: [{
                                stepId: "1-1-1-1",
                                state: "failure",
                                parentId: "1-1-1",
                                steps: []
                            }]
                        }]
                    }]
                }]
            }}
        };

        const result = findParentOfFailedSubstep(state, 1, "1");
        expect(result).toEqual("1-1-1");
    });

    const complexState = {
        buildDetails: { 1: {
            buildId: 1,
            steps : [{
                stepId: "1",
                state: "failure",
                parentId: "root",
                steps: [{
                    stepId: "1-1",
                    state: "failure",
                    parentId: "1",
                    steps: []
                }]
            }, {
                stepId: "2",
                state: "failure",
                parentId: "root",
                steps: [{
                    stepId: "2-1",
                    state: "failure",
                    parentId: "2",
                    steps: []
                }]
            }]
        }}
    };

    it("should return first failure substep", () => {
        const result = findParentOfFailedSubstep(complexState, 1, "1");
        expect(result).toEqual("1");
    });

    xit("should return second failure substep", () => {
        // TODO: Show correct failed step if several failed steps available
        const result = findParentOfFailedSubstep(complexState, 1, "2");
        expect(result).toEqual("2");
    });
});


