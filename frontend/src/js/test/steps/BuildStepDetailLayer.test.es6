/* globals describe it expect jest beforeEach afterEach */
jest.mock("../../main/DevToggles.es6");
import {
    BuildStepDetailsLayer,
    mapStateToProps,
    mapDispatchToProps,
    Output,
    output_mapStateToProps
} from "../../main/steps/BuildStepDetailLayer.es6";
import {shallow} from "enzyme";
import {HIDE_BUILD_OUTPUT} from "../../main/actions/OutputActions.es6";
import React from "react";
import * as TestUtils from "../testsupport/TestUtils.es6";


describe("BuildStepDetailsLayer", () => {

    let realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Output presentation", () => {

        it("should be hidden when output is false", () => {
            const component = shallow(<BuildStepDetailsLayer showLayer={false}/>);

            expect(component.type()).toBe(null);
        });

        it("should display output of step if not hidden", () => {
            const component =
                shallow(<Output output={ ["hierTestOutput"]} requestFn={jest.fn()}/>);

            expect(component.find(".buildStepLayer__text").text()).toBe("hierTestOutput");

        });

        it("should request output if no output exists in build step", () => {
            const requestFnMock = jest.fn();
            shallow(<Output requestFn={requestFnMock}/>);

            expect(requestFnMock).toBeCalled();
        });

        it("should call closeLayer function if close button was clicked", () => {
            //given
            let wasClicked = false;
            const closeLayerFunctionFake = () => {
                wasClicked = true;
            };

            const component = shallow(<BuildStepDetailsLayer showLayer={true} buildId={ 1 } stepName={ "2"}
                                                             requestFn={() => {
                                                             }} closeLayerFn={closeLayerFunctionFake}/>);
            component.find(".buildStepLayer__close-button").simulate("click");

            expect(wasClicked).toEqual(true);
        });

    });

    describe("Output redux", () => {
        it("should not output render props if hidden", () => {
            expect(mapStateToProps({output: {showLayer: false}}, {})).toEqual({showLayer: false});
        });

        it("should get output from buildstep", () => {
            const state = {
                output: {showOutput: true, buildId: 1, stepId: "1", content: {1: {"1": ["line1"]}}}
            };
            const expected = {output: ["line1"]};

            expect(output_mapStateToProps(state, {buildId: 1, stepId: "1"})).toEqual(expected);
        });

        it("should get undefined from buildstep if no output exists", () => {
            const state = {
                buildDetails: {1: {buildId: 1, steps: [{stepId: "1", name: "myStep"}]}},
                output: {showOutput: true, activeTab: "output", buildId: 1, stepId: "1", content: {}}
            };
            const expected = {
                buildId: 1,
                stepId: "1",
                stepName: "myStep",
                showLayer: true,
                activeTab: "output",
                stepState: "unknown"
            };

            expect(mapStateToProps(state)).toEqual(expected);
        });

        it("should dispatch HideOutputAction on closeLayerFn", () => {
            const dispatchMock = jest.fn();
            const props = mapDispatchToProps(dispatchMock);

            props.closeLayerFn();

            expect(dispatchMock).toBeCalledWith({type: HIDE_BUILD_OUTPUT});
        });
    });
});

//TODO test to display output at all