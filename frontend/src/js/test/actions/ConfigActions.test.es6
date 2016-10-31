/* globals describe it expect */
import * as subject from "actions/ConfigActions.es6";

describe("ConfigActions", () => {
    it("should return addConfiguration action object", () => {
        const newAction = subject.addConfiguration({});
        expect(newAction).toEqual({type: "addConfiguration",
                                config: {}});
    });
});