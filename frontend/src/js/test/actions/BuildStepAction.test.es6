/* globals describe it expect beforeEach afterEach */
import * as subject from "actions/BuildStepActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BuildStepActions", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return toggleToolbox action object", () => {
        const newAction = subject.toggleStepToolbox(1, "1");
        expect(newAction).toEqual({
            type: "toggleStepToolbox",
            buildId: 1, stepId: "1"
        });
    });

    it("should return toggleParallelStep action object", () => {
        const newAction = subject.toggleParallelStep(1, "1");
        expect(newAction).toEqual({
            type: "toggleParallelStep",
            buildId: 1, stepId: "1"
        });
    });
});