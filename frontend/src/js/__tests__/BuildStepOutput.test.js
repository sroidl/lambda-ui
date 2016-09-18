/* globals describe it expect jest */
import * as subject from "../BuildStepOutput.es6";
import {shallow} from "enzyme";

describe("Output presentation", () => {
  it("should be hidden when output is false", () => {
    const input = {showOutput: false};

    expect(subject.BuildStepOutput(input)).toBe(null);
  });

  it("should display output of step if not hidden", () => {
    const input = {showOutput: true, buildId: 1, stepName: "meinStep", stepId: "stepId", output: "hierTestOutput"};

    const component = shallow(subject.BuildStepOutput(input));

    expect(component.find("#outputHeader__buildId").text()).toBe("1");
    expect(component.find("#outputHeader__stepName").text()).toBe("meinStep (stepId)");
    expect(component.find("#outputContent").text()).toBe("hierTestOutput");

  });

  it("should request output if no output exists in build step", () => {
    const requestFnMock = jest.fn();
    const input = {showOutput: true, buildId: 1, stepName: "meinStep", requestFn: requestFnMock};

    shallow(subject.BuildStepOutput(input));

    expect(requestFnMock).toBeCalled();
  });

});

describe("Output redux", () => {
  it("should not output render props if hidden", () => {
    expect(subject.mapStateToProps({output: {showOutput: false}},{})).toEqual({showOutput:false});
  });

  it("should get output from buildstep", () => {
    const state = {
      buildDetails: {1: {"1": {name: "myStep"}}},
      output: {showOutput:true, buildId: 1, stepId: "1", content: {1: {"1" : ["line1"]}}}
    };
    const expected = {buildId: 1, stepId: "1", stepName: "myStep", output: ["line1"], showOutput: true};

    expect(subject.mapStateToProps(state)).toEqual(expected);
  });

  it("should get undefined from buildstep if no output exists", () => {
    const state = {
      buildDetails: {1: {"1": {name: "myStep"}}},
      output: {showOutput:true, buildId: 1, stepId: "1", content: {}}
    };
    const expected = {buildId: 1, stepId: "1", stepName: "myStep", showOutput: true};

    expect(subject.mapStateToProps(state)).toEqual(expected);
  });

});
