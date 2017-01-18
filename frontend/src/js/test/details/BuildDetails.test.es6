/* eslint-disable no-duplicate-imports */
/* globals jest describe it expect beforeEach afterEach */
jest.mock("../../main/Backend.es6");
jest.mock("../../main/actions/BackendActions.es6");
jest.mock("../../main/DevToggles.es6");
jest.mock("../../main/Utils.es6");
jest.mock("../../main/steps/InterestingStepFinder.es6");
import BuildDetailsRedux, {BuildDetails, mapStateToProps} from "../../main/details/BuildDetails.es6";
import {shallow, mount} from "enzyme";
import {MockStore} from "../testsupport/TestUtils.es6";
import React from "react";
import {Provider} from "react-redux";
import * as TestUtils from "../testsupport/TestUtils.es6";
import * as UtilMock from "../../main/Utils.es6";

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

        describe("wait for build details", () => {

            it("should display loading message if no details are in state", () => {
                const component = shallow(subject(input()));

                expect(component.text()).toEqual("Loading build details");
            });
        });

        it.only("should render all buildSteps on first level", () => {
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