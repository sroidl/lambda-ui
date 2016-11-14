/* globals describe it expect */
import {getInterestingStepId} from "steps/InterestingStepFinder.es6";

describe("getInterestingStepId", () => {
    const buildId = 1;
    const state = (newState) => {
        return {buildDetails: {1: {buildId: 1,
            steps: [
            {stepId: "1", state: "success"},
            {stepId: "2", state: newState},
            {stepId: "3", state: "success"}
        ]}
    }}};

    it("should return failure stepId", () => {
        expect(getInterestingStepId(state("failure"),buildId)).toEqual("2");
    });

    it("should return running stepId", () => {
        expect(getInterestingStepId(state("running"),buildId)).toEqual("2");
    });

    it("should return last success stepId", () => {
        expect(getInterestingStepId(state("success"),buildId)).toEqual("3");
    });
});