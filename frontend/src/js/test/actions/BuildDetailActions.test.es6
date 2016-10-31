/* globals describe it expect */
import * as subject from "actions/BuildDetailActions.es6";

describe("BuildDetailActions", () => {
    it("should return toggleBuildDetails action object", () => {
        const newAction = subject.toggleBuildDetails(1);
        expect(newAction).toEqual({type: "toggleBuildDetails",
            buildId: 1});
    });
});