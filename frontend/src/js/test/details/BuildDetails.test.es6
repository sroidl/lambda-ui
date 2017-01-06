/* eslint-disable no-duplicate-imports */
/* globals jest describe it expect beforeEach afterEach */
jest.mock("../../main/Backend.es6");
jest.mock("../../main/actions/BackendActions.es6");
jest.mock("../../main/DevToggles.es6");
jest.mock("../../main/Utils.es6");
import BuildDetailsRedux, {BuildDetails, mapStateToProps} from "details/BuildDetails.es6";
import {shallow, mount} from "enzyme";
import {MockStore} from "../testsupport/TestUtils.es6";
import React from "react";
import {Provider} from "react-redux";
import {requestDetailsPolling as requestDetailsAction} from "actions/BackendActions.es6";
import DevToggles from "../../main/DevToggles.es6";
import * as TestUtils from "../testsupport/TestUtils.es6";
import * as UtilMock from "Utils.es6";

DevToggles.handleTriggerSteps = true;


describe("BuildDetails", () => {

    const realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
        UtilMock.isBuildRunning.mockClear();
        UtilMock.isBuildRunning.mockReturnValue(false);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    const subject = (properties) => {
        const {buildId, open, requestDetailsFn, stepsToDisplay, isFinished, isPolling} = properties;
        return <BuildDetails buildId={buildId} open={open} requestDetailsFn={requestDetailsFn}
                             stepsToDisplay={stepsToDisplay} noScrollToStepFn={() => {
        }}
                             isFinished={isFinished}
                             isPolling={isPolling}
        />;
    };

    describe("BuildDetails Component", () => {

        const input = newAttributes => Object.assign({
            buildId: 1,
            open: true,
            requestDetailsFn: jest.fn(),
            isFinished: true,
            isPolling: false
        }, newAttributes);


        describe("request build details", () => {

            it("should display loading message if no details are in state", () => {
                const component = shallow(subject(input()));

                expect(component.text()).toEqual("Loading build details");
            });


            it("should request build details if no details are in the state", () => {
                const requestMockFn = jest.fn();

                shallow(subject(input({requestDetailsFn: requestMockFn, isFinished: true, isPolling: true})));

                expect(requestMockFn).toBeCalled();
            });

            it("should request build details if build is still running and no polling is active", () => {
                const requestMockFn = jest.fn();

                shallow(subject(input({
                    stepsToDisplay: [],
                    requestDetailsFn: requestMockFn,
                    isFinished: false,
                    isPolling: false
                })));

                expect(requestMockFn).toBeCalled();
            });

            it("should request build details if no details are in the state", () => {
                const requestMockFn = jest.fn();

                shallow(subject(input({
                    stepsToDisplay: [],
                    isFinished: false,
                    isPolling: true,
                    requestDetailsFn: requestMockFn
                })));

                expect(requestMockFn).not.toBeCalled();
            });
        });


        it("should render all buildSteps on first level", () => {
            const steps = [{stepId: 1}, {stepId: 2}];
            const storeMock = MockStore({
                buildDetails: {1: {buildId: 1, steps: steps}},
                openedBuilds: {1: true},
                viewBuildSteps: {},
                showParentStepBreadcrumb: {},
                showSubsteps: {}
            });

            const component = mount(<Provider store={storeMock}><BuildDetailsRedux buildId="1"/></Provider>);

            expect(component.find("BuildStep").length).toEqual(2);
        });

        it("should wire polling state to props", () => {
            const steps = [{stepId: 1}, {stepId: 2}];
            const state = {
                buildDetails: {1: {buildId: 1, steps: steps}},
                openedBuilds: {1: true},
                viewBuildSteps: {},
                showParentStepBreadcrumb: {},
                showSubsteps: {},
                polling: { 1: true }
            };

            const newProps = mapStateToProps(state, {buildId: 1});

            expect(newProps.isPolling).toBe(true);
        });

        it("should wire finished state true to props", () => {
            const steps = [{stepId: 1}, {stepId: 2}];
            const state = {
                buildDetails: {1: {buildId: 1, steps: steps}},
                openedBuilds: {1: true},
                viewBuildSteps: {},
                showParentStepBreadcrumb: {},
                showSubsteps: {},
                polling: { 1: true }
            };
            UtilMock.isBuildRunning.mockReturnValue(true);

            const newProps = mapStateToProps(state, {buildId: 1});

            expect(newProps.isFinished).toBe(false);
            expect(UtilMock.isBuildRunning).toHaveBeenCalledWith({buildId: 1, steps: steps});
        });

        it("MapDispatchToProps should wire to backend.", () => {
            const dispatchMock = jest.fn();
            const store = MockStore({buildDetails: {}, openedBuilds: {2: true}, viewBuildSteps: {}}, dispatchMock);

            mount(<BuildDetailsRedux store={store} buildId="2"/>);

            expect(dispatchMock).toBeCalled();
            expect(requestDetailsAction).toBeCalledWith("2");
        });
    });

    describe("View Build details", () => {
        it("should map root steps if no view build details is given", () => {
            const state = {
                buildDetails: {
                    1: {buildId: 1, steps: [{stepId: 1}, {stepId: 2}]}
                },
                openedBuilds: {1: true},
                viewBuildSteps: {}
            };
            const newProps = mapStateToProps(state, {buildId: 1});

            expect(newProps.stepsToDisplay).toEqual([{stepId: 1}, {stepId: 2}]);
        });
    });
});