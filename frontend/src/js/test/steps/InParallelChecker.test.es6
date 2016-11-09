/* globals describe it expect */
import {isStepInParallel} from "steps/InParallelChecker.es6";

describe("isStepInParallel", () => {
    const state = (content) => {
        return {
            buildDetails: {
                1: {
                    buildId: "1",
                    steps: content
                }
            }
        };
    };

    const buildId = 1;

    const expectation = (state, stepId, result) => {
        expect(isStepInParallel(state, buildId, stepId)).toEqual(result);
    };

    /* eslint-disable */
    it("should return false if parent step is root", () => {
        const ownState = state([{stepId: "1", parentId: "root"}]);
        const stepId = "1";

        expectation(ownState, stepId, false);
    });

    it("should return false if parent step isn't in parallel", () => {
        const ownState = state([{stepId: "1", parentId: "root", steps: [
            {stepId: "1-1", parentId: "1"}
        ]}]);
        const stepId = "1-1";
        expectation(ownState, stepId, false);
    });

    it("should return true if parent step is in parallel", () => {
        const ownState = state([{
            stepId: "1", type: "parallel", parentId: "root", steps: [
                {stepId: "1-1", parentId: "1"}
            ]
        }]);
        const stepId = "1-1";
        expectation(ownState, stepId, true);
    });

    it("should return false if valid state isn't available", () => {
        const ownState = {someState: {withRandom: "content"}};
        expectation(ownState, "1", false);
    });
});