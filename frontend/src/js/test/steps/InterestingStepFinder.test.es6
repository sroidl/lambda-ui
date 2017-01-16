/* globals jest describe it expect beforeEach afterEach */
jest.mock("../../main/DevToggles.es6");
import {
    findPathToMostInterestingStep
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
            expect(findPathToMostInterestingStep(state, 1, "1")).toBeUndefined();
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

            expect(findPathToMostInterestingStep(state, 1, "1")).toBeUndefined();
        });

        it("should find killed step although it has pending substeps", () => {
            const interesting_state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [
                            {stepId: "1", state: "success"},
                            {stepId: "2", state: "success"},
                            {
                                stepId: "3", state: "failure", steps: [
                                {
                                    stepId: "1-3", state: "failure", steps: [
                                    {stepId: "1-1-3", state: "pending"},
                                    {stepId: "2-1-3", state: "pending"}
                                ]
                                }]
                            }
                        ]
                    }
                }
            };
            expect(findPathToMostInterestingStep(interesting_state, 1, "3")).toEqual({"failure": ["3"]});
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

            expect(findPathToMostInterestingStep(state, 1, "1")).toEqual({"failure": ["1"]});
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

            expect(findPathToMostInterestingStep(state, 1, "1")).toEqual({"failure": ["1", "1-1"]});
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

            const result = findPathToMostInterestingStep(state, 1, "1");
            expect(result).toEqual({"failure":["1", "1-1", "1-1-1"]});
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
            const result = findPathToMostInterestingStep(complexState, 1, "1");
            expect(result).toEqual({"failure": ["1"]});
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

            const result = findPathToMostInterestingStep(state, 1, "1");
            expect(result).toEqual({"running": ["1", "1-1", "1-1-1"]});
        });
    });

    describe("should find path to most interesting step", () => {

        it("should return empty list if no step is interesting", () => {
            const state = {
                buildDetails: {
                    1: {
                        steps: [{ stepId: "1", state: "success"}]

                    } } };

            const result = findPathToMostInterestingStep(state, 1, "root");
            expect(result).toBeUndefined();
        });

        it("should find prioritize running over failure step", () => {
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
                        },

                            {
                                stepId: "2",
                                state: "failure"
                            }
                        ]
                    }
                }
            };

            const result = findPathToMostInterestingStep(state, 1, "root");
            expect(result).toEqual({"running": ["1", "1-1", "1-1-1"]});
        });


        it("should find failure step", () => {
            const state = {
                buildDetails: {
                    1: {
                        buildId: 1,
                        steps: [{
                            stepId: "1",
                            state: "success",
                            steps: [{
                                stepId: "1-1",
                                state: "success",
                                steps: [{
                                    stepId: "1-1-1",
                                    state: "success",
                                    steps: [{
                                        stepId: "1-1-1-1",
                                        state: "success",
                                        steps: []
                                    }]
                                }]
                            }]
                        },

                            {
                                stepId: "2",
                                state: "failure",
                                steps: [{
                                    stepId: "1-2",
                                    state: "failure",
                                }]
                            }
                        ]
                    }
                }
            };

            const result = findPathToMostInterestingStep(state, 1, "root");
            expect(result).toEqual({"failure": ["2"]});
        });


        it("should prioritize waiting over running", () => {
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
                        },

                            {
                                stepId: "2",
                                state: "waiting"
                            }
                        ]
                    }
                }
            };

            const result = findPathToMostInterestingStep(state, 1, "root");
            expect(result).toEqual({"waiting": []});
        });

    });
});