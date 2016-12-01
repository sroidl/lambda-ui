/* globals describe it expect beforeEach afterEach */
import React from "react";
import {TriggerDialog} from "steps/TriggerDialog.es6";
import {shallow} from "enzyme";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("TriggerDialog", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    const component = (showTrigger = true, parms = [], fn = () => {
    }, url = "") =>
        shallow(<TriggerDialog closeTriggerDialog={fn} parameter={parms} showTrigger={showTrigger} url={url}/>);

    it("should render triggerDialog div if parameter available", () => {
        const newComponent = component(true, [{name: "name", key: "key"}]);
        expect(newComponent.find(".triggerDialog").length).toBe(1);
    });

    it("should not render triggerDialog div if showTrigger is false", () => {
        const newComponent = component(false);
        expect(newComponent.find(".triggerDialog").length).toBe(0);
    });
});