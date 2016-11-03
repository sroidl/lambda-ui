/* globals describe expect it */
import {findFailedSubstep} from "steps/FailureStepFinder.es6";

describe("Find failed Substep", () => {
    it("should return current step if it has failed and no substeps", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    steps: []
                }]
            }}
        };
        const buildId = 1;

        const result = findFailedSubstep(state, buildId);

        expect(result).toEqual("1");

    });
    it("should return null if it is success", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "success",
                    steps: []
                }]
            }}
        };
        const buildId = 1;

        const result = findFailedSubstep(state, buildId);

        expect(result).toEqual(null);

    });

    it("should return children step if it failed", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    steps: [
                        {
                            stepId: "1-1",
                            state: "success",
                            steps: []
                        },

                        {
                            stepId: "1-2",
                            state: "failure",
                            steps: []
                        }]
                }]
            }}
        };
        const buildId = 1;

        const result = findFailedSubstep(state, buildId);

        expect(result).toEqual("1-2");

    });

    it("should return children children step if it failed", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    steps: [{
                        stepId: "1-1",
                        state: "failure",
                        steps: [{
                            stepId: "1-1-1",
                            state: "failure",
                            steps: []
                        }]
                    }]
                }]
            }}
        };

        const result = findFailedSubstep(state, 1);
        expect(result).toEqual("1-1-1");
    });
    const stateLevel4 = {
        buildDetails: { 1: {
            buildId: 1,
            steps : [{
                stepId: "1",
                state: "failure",
                steps: [{
                    stepId: "1-1",
                    state: "failure",
                    steps: [{
                        stepId: "1-1-1",
                        state: "failure",
                        steps: [{
                            stepId: "1-1-1-1",
                            state: "failure",
                            steps: []
                        }]
                    }]
                }]
            }]
        }}
    };
    it("should returnlowermost children step if it failed", () => {
        const result = findFailedSubstep(stateLevel4, 1);
        expect(result).toEqual("1-1-1-1");
    });

    it("should return children step of substep if it failed", () => {
         const result = findFailedSubstep(stateLevel4, 1);
        expect(result).toEqual("1-1-1-1");
    });

    it("should return the first failure step", () => {
        const state = {
            buildDetails: { 1: {
                buildId: 1,
                steps : [{
                    stepId: "1",
                    state: "failure",
                    steps: [{
                        stepId: "1-1",
                        state: "failure",
                        steps: []
                    }]
                }, {
                    stepId: "2",
                    state: "failure",
                    steps: [{
                        stepId: "2-1",
                        state: "failure",
                        steps: []
                    }]
                }]
            }}
        };
        const result = findFailedSubstep(state, 1);
        expect(result).toEqual("1-1");
    });
});