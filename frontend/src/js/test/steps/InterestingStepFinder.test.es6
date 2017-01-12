/* globals jest describe it expect beforeEach afterEach */
jest.mock("../../main/DevToggles.es6");
import {
    findPathToDeepestFailureStep,
    findPathToDeepestRunningStep
} from "../../main/steps/InterestingStepFinder.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("InterestingStep Finder", () => {
    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Find failed Substep", () => {

        it("should return empty array if parent step is root", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
                            stepId: "1",
                            state: "failure",
                            steps: []
                        }]
                    }
                }
            };
            expect(findPathToDeepestFailureStep(state, 1, "1")).toEqual([]);
        });

        it("should return null if it is success", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
                            stepId: "1",
                            state: "success",
                            steps: []
                        }]
                    }
                }
            };

            expect(findPathToDeepestFailureStep(state, 1, "1")).toEqual(null);
        });

        it("should find killed step although it has pending substeps", () => {
            const interesting_state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [
                            {stepId: "1", state: "success"},
                            {stepId: "2", state: "success"},
                            {stepId: "3", state: "failure", steps: [
                                {stepId: "1-3", state: "failure", steps: [
                                        {stepId: "1-1-3", state: "pending"},
                                        {stepId: "2-1-3", state: "pending"}
                                    ]
                                }]
                            }
                        ]
                    }
                }
            };
            expect(findPathToDeepestFailureStep(interesting_state, 1, "3")).toEqual(["3"]);
        });

        it("should return parent step of deepest failure step", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
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
                    }
                }
            };

            expect(findPathToDeepestFailureStep(state, 1, "1")).toEqual(["1"]);
        });

        it("should return children children step if it failed", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
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
                    }
                }
            };

            expect(findPathToDeepestFailureStep(state, 1, "1")).toEqual(["1", "1-1"]);
        });

        it("should return lowermost children step if it failed", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
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
                    }
                }
            };

            const result = findPathToDeepestFailureStep(state, 1, "1");
            expect(result).toEqual(["1", "1-1", "1-1-1"]);
        });

        const complexState = {
            buildDetails: {
                1: {
                    buildId: 1,
                    steps: [{
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
                }
            }
        };

        it("should return first failure substep", () => {
            const result = findPathToDeepestFailureStep(complexState, 1, "1");
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
                            steps: [{
                                stepId: "1-1",
                                state: "running",
                                steps: [{
                                    stepId: "1-1-1",
                                    state: "running",
                                    steps: [{
                                        stepId: "1-1-1-1",
                                        state: "running",
                                        steps: []
                                    }]
                                }]
                            }]
                        }]
                    }
                }
            };

            const result = findPathToDeepestRunningStep(state, 1, "1");
            expect(result).toEqual(["1", "1-1", "1-1-1"]);
        });
    });
});