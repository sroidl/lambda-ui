/* globals describe it expect */
import * as subject from "actions/BuildSummaryActions";

describe("BuildSummaryActions", () => {
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