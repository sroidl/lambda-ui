/* globals describe it expect  */
import * as subject from "actions/OutputActions.es6";

describe("OutputActions", () => {
    it("should return an action object", () => {
        const newAction = subject.hideBuildOutput();

        expect(newAction).toEqual({type: "hideBuildOutput"});
    });

    it("should return an action object", () => {
        const newAction = subject.addBuildstepOutput(1,1,"Output");
        expect(newAction).toEqual({type: "addBuildstepOutput",
                                buildId: 1,
                                stepId: 1,
                                output: "Output"});
    });
});

