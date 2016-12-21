/* globals jest describe it expect beforeEach afterEach */
jest.mock("../../main/DevToggles.es6");
jest.mock("../../main/actions/BuildStepActions.es6");
import React from "react";
import * as TestUtils from "../testsupport/TestUtils.es6";
import {mapStateToProps, mapDispatchToProps, BuildStep, getStepDuration, duration} from "steps/BuildStep.es6";
import {shallow} from "enzyme";
import * as Actions from "actions/BuildStepActions.es6";

describe("BuildStep", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Redux Wiring", () => {
        it("should return buildStep props", () => {
            const state = {showSubsteps: {}};
            const ownProps = {buildId: 1, step: {}};

            const newProps = mapStateToProps(state, ownProps);

            expect(newProps).toEqual({
                hasSubsteps: false,
                step: {},
                isParallel: false,
                buildId: 1,
                showSubsteps: false
            });
        });

        it("should wire togglesubsteps function", () => {
            const props = {buildId: 1, step: {stepId: 2}};
            const dispatchMock = jest.fn();
            Actions.toggleSubstep.mockReturnValue({toggle: "substeps"});


            const newProps = mapDispatchToProps(dispatchMock, props);
            newProps.toggleSubsteps();

            expect(dispatchMock).toHaveBeenCalledWith({toggle: "substeps"});
            expect(Actions.toggleSubstep).toHaveBeenCalledWith(1, 2);
        });

    });

    describe("BuildStep rendering", () => {
        const component = (step, isParallel = false, hasSubsteps = false, showSubsteps = false) =>
            <BuildStep step={step} isParallel={isParallel}
                       buildId={1} hasSubsteps={hasSubsteps}
                       toggleSubsteps={() => {
                       }} showSubsteps={showSubsteps}/>;

        it("should render buildStep", () => {
            const newComponent = shallow(component({stepId: "1", name: "Step", state: "success"}));

            expect(newComponent.find(".BuildStep").length).toBe(1);
        });

        it("should render buildStep id", () => {
            const newComponent = shallow(component({stepId: "1", name: "Step", state: "success"}));

            expect(newComponent.find("#Build1Step1").length).toBe(1);
        });

        it("should render buildStep name", () => {
            const newComponent = shallow(component({stepId: "1", name: "StepName", state: "success"}));

            expect(newComponent.contains("StepName")).toBe(true);
        });

        it("should not render substeps", () => {
            const newComponent = shallow(component({
                stepId: "1",
                name: "",
                state: "success",
                steps: [{stepId: "1-1", name: "", state: "success"}]
            }, false, true));

            expect(newComponent.find(".BuildStepWithSubsteps").length).toBe(0);
        });

        it("should render substeps", () => {
            const newComponent = shallow(component({
                stepId: "1",
                name: "",
                state: "success",
                steps: []
            }, false, true, true));

            expect(newComponent.find(".BuildStepWithSubsteps").length).toBe(1);
            expect(newComponent.find(".BuildStepSubsteps").length).toBe(1);
        });

        it("should render in parallel", () => {
            const newComponent = shallow(component({
                stepId: "1",
                name: "",
                state: "success",
                steps: []
            }, true, true, true));

            expect(newComponent.find(".BuildStepParallel").length).toBe(1);
            expect(newComponent.find(".BuildStepInParallel").length).toBe(1);
        });

    });

    describe("BuildStep duration", () => {
        it("should return same step, when endTime available", () => {
            const step = {startTime: "24:00:00", endTime: "24:00:32"};
            expect(getStepDuration(step)).toBe(step);
        });

        it("should return same step, when startTime is null", () => {
            const step = {startTime: null, endTime: null};
            expect(getStepDuration(step)).toBe(step);
        });

        it("should return step with other endTime, when endTime is null", () => {
            const step = {startTime: "24:00:00", endTime: null};
            expect(getStepDuration(step).endTime).not.toEqual(null);
        });

        it("should return in mm:ss format, when duration less then one houre", () => {
            expect(duration({startTime: "2016-11-01T14:48:16", endTime: "2016-11-01T14:48:21"})).toEqual("00:05");
            expect(duration({startTime: "2016-11-01T14:47:16", endTime: "2016-11-01T14:48:26"})).toEqual("01:10");
            expect(duration({startTime: "2016-11-01T14:38:16", endTime: "2016-11-01T14:48:51"})).toEqual("10:35");
        });

        it("should return in hh:mm:ss format, when duration more then one houre", () => {
            expect(duration({startTime: "2016-11-01T13:48:16", endTime: "2016-11-01T14:48:21"})).toEqual("01:00:05");
            expect(duration({startTime: "2016-11-01T04:47:16", endTime: "2016-11-01T14:48:26"})).toEqual("10:01:10");
            expect(duration({startTime: "2016-11-01T00:38:16", endTime: "2016-11-01T14:48:51"})).toEqual("14:10:35");
        });
    });
});