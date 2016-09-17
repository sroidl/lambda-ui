/* globals describe, it, expect */
/* eslint-disable */
import * as subject from "../BuildDetailBreadcrumb.es6";
import {shallow} from "enzyme";
import * as R from "ramda";

describe("Breadcrumb presentation", () => {
  it("should show no breadcrumb if no step is given", () => {
    expect(subject.BuildDetailBreadcrumb({steps: []})).toEqual(null);
  });

  it("should show breadcrumb of steps in order of list", () => {
    const steps = [{name: "first"}, {name: "Second"}];
    const input = {steps: steps, viewStepFn: () => {}}
    expect(shallow(subject.BuildDetailBreadcrumb(input)).find(".buildDetailBreadcrumb").text()).toEqual(" > first > Second");
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
});
