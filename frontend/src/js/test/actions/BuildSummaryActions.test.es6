/* globals describe it expect beforeEach afterEach */
import * as subject from "actions/BuildSummaryActions";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BuildSummaryActions", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return addBuildSummary action object", () => {
        const newAction = subject.addBuildSummary({});
        expect(newAction).toEqual({type: "addBuildSummaries",
                                summaries: {}});
    });

    it("should return changeBuildSummary action object", () => {
        const newAction = subject.changeBuildSummary(1, {});
        expect(newAction).toEqual({type: "changeBuildSummary",
                                buildId: 1,
                                newAttributes: {}});
    });
});