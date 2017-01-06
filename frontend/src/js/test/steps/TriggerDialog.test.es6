/* eslint-disable */
/* globals describe it expect beforeEach afterEach */
jest.mock("../../main/App.es6");
import React from "react";
import ConnectedTriggerDialog, {TriggerDialog} from "../../main/steps/TriggerDialog.es6";
import {shallow} from "enzyme";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {MockStore} from "../testsupport/TestUtils.es6";
import appMock from "../../main/App.es6";


describe("TriggerDialog", () => {

    let realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);


        appMock.backend.mockReturnValue({triggerStep: () => {}});
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

    xdescribe("React/Redux Wiring", () => {

        it("should not show trigger dialog if state is empty", () => {
            const store = MockStore({triggers: {}}, jest.fn());
            const component = shallow(<ConnectedTriggerDialog store={store}/>).find(TriggerDialog).shallow();

            expect(component.html()).toBe(null);
        });

        it("should show trigger dialog if state is empty", () => {
            const dialog = {
                showTrigger: true,
                triggerName: "Trigger-Name",
                closeTriggerDialog: () => {
                },
                parameter: []
            }
            const store = MockStore({triggers: {triggerDialog: dialog}}, jest.fn());
            const component = shallow(<ConnectedTriggerDialog store={store}/>).find(TriggerDialog).shallow();

            expect(component.find(".triggerTitle").text()).toBe("Trigger-Name");
        });
    });
});
/*
 parameter: PropTypes.array,
 url: PropTypes.string,
 closeTriggerDialog: PropTypes.func.isRequired,
 showTrigger: PropTypes.bool,
 triggerName: PropTypes.string
 */