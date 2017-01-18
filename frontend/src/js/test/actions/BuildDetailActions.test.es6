/* globals describe it expect beforeEach afterEach */
import * as subject from "../../main/actions/BuildDetailActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BuildDetailActions", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return toggleBuildDetails action object", () => {
        const newAction = subject.toggleBuildDetails(1);
        expect(newAction).toEqual({
            type: "toggleBuildDetails",
            buildId: 1
        });
    });

    it("should return addBuildDetails action object", () => {
        const newAction = subject.addBuildDetails(1, {});
        expect(newAction).toEqual({
            type: "addBuildDetails",
            buildId: 1,
            buildDetails: {}
        });
    });

    it("should return scrollToStep action object", () => {
        const newAction = subject.scrollToStep(1,"1");
        expect(newAction).toEqual({
            type: "scrollToStep",
            buildId: 1,
            stepId: "1"
        });
    });

    it("should return noScrollToStep action object", () => {
        const newAction = subject.noScrollToStep();
        expect(newAction).toEqual({
            type: "noScrollToStep"
        });
    });
});


describe("BuildDetailActions > expandAll", () => {

});