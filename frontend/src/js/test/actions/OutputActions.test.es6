/* globals describe it expect  */
import * as subject from "actions/OutputActions.es6";

describe("OutputActions", () => {
    it("should return an action object", () => {
        const newAction = subject.hideBuildOutput();

        expect(newAction).toEqual({type: "hideBuildOutput"});
    });
})

