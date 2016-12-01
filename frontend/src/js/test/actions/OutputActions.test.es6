/* globals describe it expect beforeEach afterEach */
import * as subject from "actions/OutputActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
describe("OutputActions", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });


    it("should return an action object", () => {
        const newAction = subject.hideBuildOutput();

        expect(newAction).toEqual({type: "hideBuildOutput"});
    });

    it("should return an action object", () => {
        const newAction = subject.addBuildstepOutput(1, 1, "Output");
        expect(newAction).toEqual({
            type: "addBuildstepOutput",
            buildId: 1,
            stepId: 1,
            output: "Output"
        });
    });

    it("should return outputConnectionState action object", () => {
        const newAction = subject.outputConnectionState({});
        expect(newAction).toEqual({
            type: "outputConnectionState",
            state: {}
        });
    });

    it("should return showBuildOutput action object", () => {
        const newAction = subject.showBuildOutput(1, 2);
        expect(newAction).toEqual({
            type: "showOutput",
            buildId: 1,
            stepId: 2
        });
    });
});

