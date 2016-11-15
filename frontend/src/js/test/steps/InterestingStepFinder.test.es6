/* globals describe it expect */
import {getInterestingStepId} from "steps/InterestingStepFinder.es6";

describe("getInterestingStepId", () => {
    const buildId = 1;
    const state = (newState, viewBuildStep) => {
        return {
            buildDetails: {
                1: {
                    buildId: 1,
                    steps: [
                        {stepId: "1", state: "success", parentId: "root1"},
                        {stepId: "2", state: newState, parentId: "root2"},
                        {stepId: "3", state: "success", parentId: "root3"}
                    ]
                }
            },
            viewBuildSteps: {1: viewBuildStep}
        };
    };
    it("should return failure stepId", () => {
        expect(getInterestingStepId(state("failure", "__showInterestingStep"),buildId)).toEqual("root2");
    });

    it("should return running stepId", () => {
        expect(getInterestingStepId(state("running", "__showInterestingStep"),buildId)).toEqual("root2");
    });

    it("should return last waiting stepId", () => {
        expect(getInterestingStepId(state("waiting", "__showInterestingStep"),buildId)).toEqual("root2");
    });
    it("should return viewBuildStep value if viewBuildStep isn't __showInterestingStep", () => {
        expect(getInterestingStepId(state("success", "1"), buildId)).toBe("1");
    });
});