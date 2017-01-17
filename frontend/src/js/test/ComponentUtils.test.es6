/* globals describe it expect beforeEach afterEach */
/* eslint-disable no-undefined */
import subject from "ComponentUtils.es6";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

describe("ComponentUtils test", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should concatenate class names", () => {
        expect(subject.classes("foo", "bar")).toEqual("foo bar");
    });

    it("should be null safe", () => {
        expect(subject.classes("foo", null, undefined, "bar")).toEqual("foo bar");
    });

});
