/* globals describe, it, expect */
/* eslint-disable */
import * as subject from "../BuildDetailBreadcrumb.es6";
import {shallow} from "enzyme";
import * as R from "ramda";

describe("Breadcrumb presentation", () => {
  it("should show only root if no step is given", () => {

    expect(shallow(subject.BuildDetailBreadcrumb([])).find(".buildDetailBreadcrumb").text()).toEqual(">");

  });

  it("should show breadcrumb of steps in order of list", () => {
    const steps = [{stepName: "first"}, {stepName: "Second"}];
    expect(shallow(subject.BuildDetailBreadcrumb({steps: steps})).find(".buildDetailBreadcrumb").text()).toEqual(" > first > Second");
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
    const input = {stepId: "root", stepName: "root"};

    const actual = subject.calculateBreadcrumb(input, "root");

    expect(actual).toEqual([{stepName: "root", stepId: "root"}]);

  });

  it("should calculate current breadcrumb when input is step", () => {
    const input = {stepId: "root", stepName: "root", steps: [{stepId: "1", stepName: "substep"}]};

    const actual = subject.calculateBreadcrumb(input, "1");

    expect(actual).toEqual([{stepName: "root", stepId: "root"}, {stepId: "1", stepName: "substep"}]);

  })

});
