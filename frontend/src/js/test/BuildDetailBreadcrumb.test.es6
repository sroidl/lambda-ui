/* globals describe, it, expect */
/* eslint-disable */
import React from "react";
import * as subject from "BuildDetailBreadcrumb.es6";
import {BuildDetailBreadcrumb, BreadcrumbLink} from "BuildDetailBreadcrumb.es6";
import {viewBuildStep} from "actions/BuildDetailActions.es6";
import {shallow} from "enzyme";

describe("BreadcrumbLink", () => {
    it("should render correct name", () => {
        const component = shallow(<BreadcrumbLink name={"Name"} clickFn={()=> {
        }}/>);

        expect(component.contains("Name")).toBe(true);
    });

    it("should render className", () => {
        const component = shallow(<BreadcrumbLink name="Name" clickFn={() => {
        }}/>);
        expect(component.find(".breadcrumbLink").length).toBe(1);
    });
});

describe("Breadcrumb presentation", () => {
    it("should show one root breadcrumb if no step is given", () => {
        const component = shallow(<BuildDetailBreadcrumb steps={[]}
                                                         viewStepFn={() =>{}}
                                                         buildId={1}
                                                         showParentStepBreadcrumb={false}
                                                         showParentStepsFn={() => {}} /> );

        expect(component.text()).toEqual("<BreadcrumbLink />");
    });

    it("should show breadcrumb of all steps if showParentStepBreadcrumb is true", () => {
        const steps = [{name: "first"}, {name: "Second"}];
        const input = {
            steps: steps, viewStepFn: () => {
            }, buildId: 1, showParentStepBreadcrumb: true
        }
        const component = shallow(<BuildDetailBreadcrumb steps={steps}
                                                         viewStepFn={() =>{}}
                                                         buildId={1}
                                                         showParentStepBreadcrumb={true}
                                                         showParentStepsFn={() => {}} /> );

        expect(component.find(".buildDetailBreadcrumb").text()).toEqual("<BreadcrumbLink /><BreadcrumbLink /><BreadcrumbLink />");
    })
});

describe("Breadcrumb calculation", () => {
    it("should expandParentStepId: substep of step", () => {
        const input = {stepId: "0", steps: [{stepId: "1"}]};
        const expected = [{stepId: "0", steps: [{stepId: "1", parentId: "0"}]}, {stepId: "1", parentId: "0"}];

        expect(subject.expandParents(input)).toEqual(expected);
    });

    it("should expandParentStepId: substep of step", () => {
        const input = {stepId: "0", steps: [{stepId: "1"}]};
        const expected = [{stepId: "0", steps: [{stepId: "1", parentId: "0"}]}, {stepId: "1", parentId: "0"}];

        expect(subject.expandParents(input)).toEqual(expected);
    });

    it("should expandParentStepId: substep of root", () => {
        const input = {steps: [{stepId: "1"}]};
        const expected = [{steps: [{stepId: "1", parentId: undefined}]}, {stepId: "1", parentId: undefined}];

        expect(subject.expandParents(input)).toEqual(expected);
    });

    it("should calculate current breadcrumb when input is root", () => {
        const input = {stepId: "root", name: "root"};

        const actual = subject.calculateBreadcrumb(input, "root");

        expect(actual).toEqual([]);

    });

    it("should calculate current breadcrumb when input is step", () => {
        const input = {stepId: "root", name: "root", steps: [{stepId: "1", name: "substep"}]};

        const actual = subject.calculateBreadcrumb(input, "1");

        expect(actual).toEqual([{stepId: "1", name: "substep"}]);

    });

    it("should calculate current breadcrumb without parallel steps", () => {
        const input = {stepId: "root", name: "root", steps: [{stepId: "1", name: "substep", type: "parallel", steps: [{stepId: "1-1", name: "subsubstep"}]}]};

        const actual = subject.calculateBreadcrumb(input, "1");

        expect(actual).toEqual([]);
    });
});

describe("Breadcrumb redux component", () => {
    it("should show root component if no viewBuildStep is set", () => {
        const state = {buildDetails: {1: {}}, viewBuildSteps: {}};

        const actual = subject.mapStateToProps(state, {buildId: 1});

        expect(actual).toEqual({buildId: 1, steps: []});
    });

    it("should show inner step breadcrumb if it was chosen", () => {
        const state = {
            buildDetails: {1: {steps: [{stepId: "1", name: "innerStep"}]}},
            viewBuildSteps: {1: "1"}
        };

        const actual = subject.mapStateToProps(state, {buildId: 1});

        expect(actual).toEqual({
            buildId: 1,
            steps: [{stepId: "1", name: "innerStep"}]
        });
    });

    it("should dispatch a view build step action", () => {
        const input = {stepId: 42};
        const dispatchMock = jest.fn();

        subject.mapDispatchToProps(dispatchMock, {buildId: 1}).viewStepFn(input.stepId);

        expect(dispatchMock).toBeCalledWith(viewBuildStep(1, input.stepId));
    });
});
