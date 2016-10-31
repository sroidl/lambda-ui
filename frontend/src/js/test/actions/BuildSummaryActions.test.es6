/* globals describe it expect */
import * as subject from "actions/BuildSummaryActions";

describe("BuildSummaryActions", () => {
    it("should return addBuildSummary action object", () => {
        const newAction = subject.addBuildSummary({});
        expect(newAction).toEqual({type: "addBuildSummaries",
                                summaries: {}});
    });
});