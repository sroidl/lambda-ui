/* globals describe it expect */
import {openTriggerDialog, closeTriggerDialog} from "actions/BuildStepTriggerActions.es6";

describe("BuildStepTriggerActions", () => {
    it("should return openTriggerDialog action object", () => {
        const inputParameter = [{name: "name", key: "key"}];
        const newAction = openTriggerDialog("testURL", inputParameter, "triggerName");
        expect(newAction).toEqual({type: "openTriggerDialog", url: "testURL", parameter: inputParameter, triggerName: "triggerName"});
    });

    it("should return closeTriggerDialog action object", () => {
        const newAction = closeTriggerDialog();
        expect(newAction).toEqual({type: "closeTriggerDialog"});
    });
});