/* globals describe it expect beforeEach afterEach */
import * as subject from "actions/ConfigActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("ConfigActions", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return addConfiguration action object", () => {
        const newAction = subject.addConfiguration({});
        expect(newAction).toEqual({type: "addConfiguration",
                                config: {}});
    });
});