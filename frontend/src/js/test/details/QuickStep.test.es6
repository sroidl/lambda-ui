/* globals describe it expect beforeEach afterEach */
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {QuickStep, mapStateToProps} from "details/QuickStep.es6";
import {shallow} from "enzyme";
import React from "react";

describe("Quickstep", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Rendering", () => {
        const step = {stepId: "1", state: "success", name: "stepName", steps: [{stepId: "1-1", name: "stepName2"}]};
        const component = (maxDepth = 1,curDepth = 1, showSubsteps = true) => <QuickStep maxDepth={maxDepth} buildId={1}
                                     curDepth={curDepth} scrollToStep={() => {}}
                                     showSubsteps={showSubsteps} step={step} />;

        it("should render QuickStep", () => {
            const newComponent = shallow(component());

            expect(newComponent.find(".quickStep").length).toBe(1);
        });

        it("should render QuickStep with Substeps", () => {
            const newComponent = shallow(component(2));

            expect(newComponent.find(".quickStepContainer").length).toBe(1);
            expect(newComponent.find(".quickSubsteps").length).toBe(1);
        });

        it("should render no substeps if maxDepth is reached", () => {
            const newComponent = shallow(component(2,2,true));

            expect(newComponent.find(".quickStepContainer").length).toBe(0);
            expect(newComponent.find(".quickSubsteps").length).toBe(0);
        });
    });

    describe("mapStateToProps", () => {
        it("should return ownProps", () => {
            const oldState = {showSubsteps: {}};

            const ownProps = mapStateToProps(oldState, {buildId: 1, step: {}, maxDepth: 1, curDepth: 1});

            expect(ownProps).toEqual({buildId: 1, step: {}, maxDepth: 1, curDepth: 1, showSubsteps: false});
        });

        it("should return ownProps with showSubsteps true", () => {
            const oldState = {showSubsteps: {1: {"1": true}}};

            const ownProps = mapStateToProps(oldState, {buildId: 1, step: {stepId: "1"}, maxDepth: 1, curDepth: 1});

            expect(ownProps).toEqual({buildId: 1, step: {stepId: "1"}, maxDepth: 1, curDepth: 1, showSubsteps: true});
        });
    });

});