/* globals jest describe it expect beforeEach afterEach */
jest.mock("../../main/DevToggles.es6");
import {getInterestingStepId, findParentOfFailedSubstep, findParentOfRunningSubstep} from "steps/InterestingStepFinder.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

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

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return failure stepId", () => {
        expect(getInterestingStepId(state("failure", "__showInterestingStep"), buildId)).toEqual("root2");
    });

    it("should return running stepId", () => {
        expect(getInterestingStepId(state("running", "__showInterestingStep"), buildId)).toEqual("root2");
    });

    it("should return last waiting stepId", () => {
        expect(getInterestingStepId(state("waiting", "__showInterestingStep"), buildId)).toEqual("root2");
    });

    describe("Find failed Substep", () => {

        it("should return emty array if parent step is root", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
                            stepId: "1",
                            state: "failure",
                            parentId: "root",
                            steps: []
                        }]
                    }
                }
            };
            expect(findParentOfFailedSubstep(state, 1, "1")).toEqual([]);
        });
        it("should return null if it is success", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
                            stepId: "1",
                            state: "success",
                            parentId: "root",
                            steps: []
                        }]
                    }
                }
            };

            expect(findParentOfFailedSubstep(state, 1, "1")).toEqual(null);
        });

        it("should return children step if it failed", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
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
                    }
                }
            };

            expect(findParentOfFailedSubstep(state, 1, "1")).toEqual(["1"]);
        });

        it("should return children children step if it failed", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
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
                    }
                }
            };

            expect(findParentOfFailedSubstep(state, 1, "1")).toEqual(["1", "1-1"]);
        });

        it("should return lowermost children step if it failed", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
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
                    }
                }
            };

            const result = findParentOfFailedSubstep(state, 1, "1");
            expect(result).toEqual(["1", "1-1", "1-1-1"]);
        });

        const complexState = {
            buildDetails: {
                1: {
                    buildId: 1,
                    steps: [{
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
                }
            }
        };

        it("should return first failure substep", () => {
            const result = findParentOfFailedSubstep(complexState, 1, "1");
            expect(result).toEqual(["1"]);
        });
    });

    describe("findParentOfRunningSubstep", () => {
        it("should return running substep", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
                            stepId: "1",
                            state: "running",
                            parentId: "root",
                            steps: [{
                                stepId: "1-1",
                                state: "running",
                                parentId: "1",
                                steps: [{
                                    stepId: "1-1-1",
                                    state: "running",
                                    parentId: "1-1",
                                    steps: [{
                                        stepId: "1-1-1-1",
                                        state: "running",
                                        parentId: "1-1-1",
                                        steps: []
                                    }]
                                }]
                            }]
                        }]
                    }
                }
            };

            const result = findParentOfRunningSubstep(state, 1, "1");
            expect(result).toEqual(["1", "1-1", "1-1-1"]);
        });
    });
});