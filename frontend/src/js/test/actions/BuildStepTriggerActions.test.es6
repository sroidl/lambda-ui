/* globals describe it expect afterEach beforeEach */
import {openTriggerDialog, closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("BuildStepTriggerActions", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return openTriggerDialog action object", () => {
        const inputParameter = [{name: "name", key: "key"}];
        const newAction = openTriggerDialog("testURL", inputParameter, "triggerName");
        expect(newAction).toEqual({
            type: "openTriggerDialog",
            url: "testURL",
            parameter: inputParameter,
            triggerName: "triggerName"
        });
    });

    it("should return closeTriggerDialog action object", () => {
        const newAction = closeTriggerDialog();
        expect(newAction).toEqual({type: "closeTriggerDialog"});
    });
});