/* globals jest describe expect it beforeEach afterEach */
jest.mock("../main/actions/BuildDetailActions.es6");
jest.mock("../main/actions/OutputActions.es6");
jest.mock("../main/DevToggles.es6");
import React from "react";
import {shallow} from "enzyme";
import {BuildStep, getStepDuration, duration, StepInfos} from "BuildStep.es6";
import DevToggles from "DevToggles.es6";

DevToggles.handleTriggerSteps = true;

const details = newAttributes => Object.assign({stepId: 1, state: "success", name: "fooStep"}, newAttributes);

describe("BuildStep", () => {

    let realConsole;

    beforeEach(() => {
        const consoleThrowing = {
            error: (...args) => {
                realConsole.error("Got errors on console: ", args);
                throw new Error(args);
            },
            log: (...args) => {
                realConsole.log(args);
            }
        };
        realConsole = window.console;
        window.console = consoleThrowing;
    });

    afterEach(() => {
        window.console = realConsole;
    });

    describe("BuildStep rendering", () => {

        const subject = (buildId, stepData, inParallel, showToolbox = false, showDirectlyInParallel = false) =>
            <BuildStep buildId={buildId}
                       step={stepData}
                       failureStep={"1"}
                       isParallel={inParallel}
                       showDirectlyInParallel={showDirectlyInParallel}
                       toggleParallelStep={()=> {
                       }}/>;

        it("should render all step information for no inParallel step", () => {
            const input = details();

            const component = shallow(subject(1, input, false));

            expect(component.find(".buildStep").hasClass("success")).toBe(true);
            expect(component.find(".buildStep").hasClass("inParallel")).toBe(false);
            expect(component.contains(<div className="verticalLine"></div>)).toBe(false);
        });

        it("should render failed step state", () => {
            const component = shallow(subject(1, details({state: "failed"}), false));
            expect(component.find(".buildStep").hasClass("failed")).toBe(true);
        });

        it("should render running step state", () => {
            const component = shallow(subject(1, details({state: "running"}), false));
            expect(component.find(".buildStep").hasClass("running")).toBe(true);
        });

        it("should render pending step state", () => {
            const component = shallow(subject(1, details({state: "pending"}), false));
            expect(component.find(".buildStep").hasClass("pending")).toBe(true);
        });

        it("should render parallel step", () => {
            const component = shallow(subject(1, details(), true));
            expect(component.find(".buildStep").hasClass("inParallel")).toBe(true);
        });

        it("should not render parallel column if step have type parallel and showDirectlyInParallel is false", () => {
            const component = shallow(subject(1, details({
                type: "parallel",
                steps: [{stepId: "1-1"}]
            }), false, false, false));
            expect(component.is(".parallelColumn")).toBe(false);
            expect(component.find(".parallelLeft").length).toBe(0);
            expect(component.find(".parallelRight").length).toBe(0);
        });

        it("should render parallel column if step have type parallel and showDirectlyInParallel is true", () => {
            const component = shallow(subject(1, details({
                type: "parallel",
                steps: [{stepId: "1-1"}]
            }), false, false, true));
            expect(component.is(".parallelColumn")).toBe(true);
            expect(component.find(".parallelLeft").length).toBe(1);
            expect(component.find(".parallelRight").length).toBe(1);
        });

        it("should render no parallel column if parent step is parallel", () => {
            const component = shallow(subject(1, details({type: "parallel", steps: [{stepId: "1-1"}]}), true));
            expect(component.is(".buildStep")).toBe(true);
            expect(component.is(".parallelColumn")).toBe(false);
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

    describe("BuildStep infos", () => {
        const stepInfos = (isTriggerInfo = false) => <StepInfos step={{
            state: "success",
            name: "stepName",
            startTime: "2016-11-01T13:48:16",
            endTime: "2016-11-01T14:48:21"
        }} isTriggerInfo={isTriggerInfo}/>;

        it("should render stepName", () => {
            const component = shallow(stepInfos());
            expect(component.contains("stepName")).toBe(true);
        });

        it("should have correct css Classes", () => {
            const component = shallow(stepInfos());
            expect(component.find(".stepName").length).toBe(1);
            expect(component.find(".stepDuration").length).toBe(1);
        });

        it("should not render stepDuration if step is triggerStep", () => {
            const component = shallow(stepInfos(true));
            expect(component.find(".stepDuration").length).toBe(0);
        });
    });
});