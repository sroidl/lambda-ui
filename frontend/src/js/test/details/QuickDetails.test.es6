/* globals describe it expect beforeEach afterEach jest */
/* eslint-disable no-duplicate-imports */
jest.mock("../../main/DevToggles.es6");
jest.mock("../../main/actions/BuildDetailActions.es6");
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {QuickDetails} from "../../main/details/QuickDetails.es6";
import * as subject from "../../main/details/QuickDetails.es6";
import {shallow} from "enzyme";
import React from "react";
import DevToggles from "../../main/DevToggles.es6";
import {openSubsteps, closeSubsteps} from "../../main/actions/BuildStepActions.es6";

DevToggles.quickDetails_expandCollapse = true;

describe("QuickDetails", () => {

    const realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Presentation", () => {
        const steps = [{stepId: 1}];
        let expandMock;
        let collapseMock;
        let component;

        beforeEach(() => {
            expandMock = jest.fn();
            collapseMock = jest.fn();
            component = shallow(<QuickDetails buildId={1} steps={steps} expandAllFn={expandMock}
                                              collapseAllFn={collapseMock}/>);
        });

        it("should render QuickDetails", () => {
            expect(component.find(".quickDetails").length).toBe(1);
        });

        it("should render QuickDetails Title", () => {
            expect(component.find(".quickTitle").length).toBe(1);
        });

        it("should render expand link", () => {
            const expandAll = component.find(".quickDetails__expand-all");

            expect(expandAll.length).toBe(1);
            expect(expandAll.text()).toEqual("Expand All");

        });

        it("should render collapse link", () => {
            const collapseAll = component.find(".quickDetails__collapse-all");

            expect(collapseAll.length).toBe(1);
            expect(collapseAll.text()).toEqual("Collapse All");

        });

        it("should connect expandFn to expand link", () => {
            component.find(".quickDetails__expand-all").simulate("click");

            expect(expandMock).toHaveBeenCalled();
        });

        it("should connect collapseFn to collapse link", () => {
            component.find(".quickDetails__collapse-all").simulate("click");

            expect(collapseMock).toHaveBeenCalled();
        });

    });

    describe("Redux wiring", () => {
        it("map stateToProps return ownProps", () => {
            const oldState = {buildDetails: {1: {steps: [{stepId: "1", some: "step"}]}}};

            const ownProps = subject.mapStateToProps(oldState, {buildId: 1, maxDepth: 1});

            expect(ownProps).toEqual({buildId: 1, maxDepth: 1, steps: [{some: "step", stepId: "1"}], stepIds: ["1"]});
        });

        it("should dispatch openSubstepsAction on all steps", () => {
            const dispatch = jest.fn();
            const oldProps = {buildId: 1};
            const stateProps = {stepIds: ["1", "2"]};
            const dispatchProps = subject.mapDispatchToProps(dispatch, oldProps);
            const actualProps = subject.mergeProps(stateProps, dispatchProps, oldProps);

            actualProps.expandAllFn();

            expect(dispatch).toHaveBeenCalledWith(openSubsteps(1, "1"));
            expect(dispatch).toHaveBeenCalledWith(openSubsteps(1, "2"));
        });

        it("should map collapseAll Action to collapse All fn", () => {
            const dispatch = jest.fn();
            const oldProps = {buildId: 1};
            const stateProps = {stepIds: ["1", "2"]};
            const dispatchProps = subject.mapDispatchToProps(dispatch, oldProps);
            const actualProps = subject.mergeProps(stateProps, dispatchProps, oldProps);

            actualProps.collapseAllFn();

            expect(dispatch).toHaveBeenCalledWith(closeSubsteps(1, "1"));
            expect(dispatch).toHaveBeenCalledWith(closeSubsteps(1, "2"));
        });


    });

});