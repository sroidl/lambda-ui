/* globals describe, it, expect */
/* eslint-disable */
import React from "react";
import * as subject from "../BuildDetailBreadcrumb.es6";
import {BuildDetailBreadcrumb} from "../BuildDetailBreadcrumb.es6";
import {shallow} from "enzyme";
import * as R from "ramda";
import {viewBuildStep} from "../Actions.es6";

const emptyFn = () => {};

describe("Breadcrumb presentation", () => {
  it("should show no breadcrumb if no step is given", () => {
    expect(shallow(subject.BuildDetailBreadcrumb({steps: [], buildId: 1})).text()).toEqual("Build 1");
  });

  it("should show breadcrumb of steps in order of list", () => {
    const steps = [{name: "first"}, {name: "Second"}];
    const input = {steps: steps, viewStepFn: () => {}, buildId: 1}
    expect(shallow(subject.BuildDetailBreadcrumb(input)).find(".buildDetailBreadcrumb").text()).toEqual("Build 1 > first > Second");
  });

  it("should show link for each step in breadcrumb", () => {
    const steps = [{name: "stepName", stepId: "stepId"}];
    const buildId = 1;

    const component = shallow(<BuildDetailBreadcrumb buildId={buildId} steps={steps} viewStepFn={emptyFn}/>);

    expect(component.find("#bcrumb-1-stepId").length).toBe(1);
  });

  it("should link to the viewBuildStep function", () => {
    const steps = [{name: "stepName", stepId: "stepId"}];
    const clickFn = jest.fn();
    const buildId = 1;

    const component = shallow(<BuildDetailBreadcrumb buildId={buildId} steps={steps} viewStepFn={clickFn}/>);

    component.find("#bcrumb-1-stepId").simulate("click");


    expect(clickFn).toBeCalledWith(1, "stepId");
  });
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
});

describe("Breadcrumb redux component", () => {
  it("should show root component if no viewBuildStep is set", () => {
    const state = {buildDetails: {1: {}}, viewBuildSteps: {}};

    const actual = subject.mapStateToProps(state, {buildId: 1});

    expect(actual).toEqual({buildId: 1, steps: []});
  });

  it("should show inner step breadcrumb if it was chosen", () => {
    const state = {buildDetails: {1: {steps: [{stepId: "1", name: "innerStep"}]}}, viewBuildSteps: {1: "1"}};

    const actual = subject.mapStateToProps(state, {buildId: 1});

    expect(actual).toEqual({buildId: 1, steps: [{stepId: "1", name: "innerStep"}]});
  });

  it("should dispatch a view build step action", () => {
    const input = {buildId: 1, stepId: 42};
    const dispatchMock = jest.fn();

    subject.mapDispatchToProps(dispatchMock).viewStepFn(input.buildId, input.stepId);

    expect(dispatchMock).toBeCalledWith(viewBuildStep(input.buildId, input.stepId));
  });
});
