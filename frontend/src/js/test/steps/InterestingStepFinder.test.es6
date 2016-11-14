/* globals describe it expect */
import {getInterestingStepId} from "steps/InterestingStepFinder.es6";

describe("getInterestingStepId", () => {
    const buildId = 1;
    const state = (newState) => {
        return {buildDetails: {1: {buildId: 1,
            steps: [
            {stepId: "1", state: "success", parentId: "root1"},
            {stepId: "2", state: newState, parentId: "root2"},
            {stepId: "3", state: "success", parentId: "root3"}
        ]}
    }}};

    it("should return failure stepId", () => {
        expect(getInterestingStepId(state("failure"),buildId)).toEqual("root2");
    });

    it("should return running stepId", () => {
        expect(getInterestingStepId(state("running"),buildId)).toEqual("root2");
    });

    it("should return last success stepId", () => {
        expect(getInterestingStepId(state("success"),buildId)).toEqual("root3");
    });
});