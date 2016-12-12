/* globals describe it expect beforeEach afterEach */
import React from "react";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {mapStateToProps, BuildStep} from "newSteps/BuildStep.es6";
import {shallow} from "enzyme";

describe("BuildStep", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("mapStateToProps", () => {
        it("should return buildStep props", () => {
            const state = {};
            const ownProps = {buildId: 1, step: {}};

            const newProps = mapStateToProps(state, ownProps);

            expect(newProps).toEqual({hasSubsteps: false, step: {}, isParallel: false, buildId: 1, showSubsteps: true});
        });
    });

    describe("BuildStep rendering", () => {
        const component = (step, isParallel = false, hasSubsteps = false, showSubsteps = false) =>
            <BuildStep step={step} isParallel={isParallel}
                       buildId={1} hasSubsteps={hasSubsteps}
                       toggleSubsteps={() => {}} showSubsteps={showSubsteps} />;

        const cssClass = cssClass => ".n" + cssClass;

        it("should render buildStep", () => {
            const newComponent = shallow(component({stepId: "1", name: "Step", state: "success"}));

            expect(newComponent.find(cssClass("BuildStep")).length).toBe(1);
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
            const newComponent = shallow(component({stepId: "1", name: "", state: "success", steps: [{stepId: "1-1", name: "", state: "success"}]}, false, true));

            expect(newComponent.find(cssClass("BuildStepWithSubsteps")).length).toBe(0);
        });

        it("should render substeps", () => {
            const newComponent = shallow(component({stepId: "1", name: "", state: "success", steps: []}, false, true, true));

            expect(newComponent.find(cssClass("BuildStepWithSubsteps")).length).toBe(1);
            expect(newComponent.find(cssClass("BuildStepSubsteps")).length).toBe(1);
        });

        it("should render in parallel", () => {
            const newComponent = shallow(component({stepId: "1", name: "", state: "success", steps: []}, true, true, true));

            expect(newComponent.find(cssClass("BuildStepParallel")).length).toBe(1);
            expect(newComponent.find(cssClass("BuildStepInParallel")).length).toBe(1);
        });

    });
});