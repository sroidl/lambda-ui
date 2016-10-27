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
        const stepId = "1";

        const result = findFailedSubstep(state, buildId, stepId);

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
        const stepId = "1";

        const result = findFailedSubstep(state, buildId, stepId);

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
        const stepId = "1";

        const result = findFailedSubstep(state, buildId, stepId);

        expect(result).toEqual("1-2");

    });
});