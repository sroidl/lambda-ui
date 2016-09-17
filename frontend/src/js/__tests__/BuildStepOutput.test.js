/* globals describe it expect */
import * as subject from "../BuildStepOutput.es6";
import {shallow} from "enzyme";

describe("Output presentation", () => {
  it("should be hidden when output is false", () => {
    const input = {showOutput: false};

    expect(subject.BuildStepOutput(input)).toBe(null);
  });

  it("should display output of step if not hidden", () => {
    const input = {showOutput: true, buildId: 1, stepName: "meinStep", output: "hierTestOutput"};

    const component = shallow(subject.BuildStepOutput(input));

    expect(component.find("#outputHeader__buildId").text()).toBe("1");
    expect(component.find("#outputHeader__stepName").text()).toBe("meinStep");
    expect(component.find("#outputContent").text()).toBe("hierTestOutput");

  });
});

describe("Output redux", () => {
  it("should not output render props if hidden", () => {
    expect(subject.mapStateToProps({output: {showOutput: false}},{})).toEqual({showOutput:false});
  });

  it("should get output from buildstep", () => {
    const state = {
      buildDetails: {1: {steps: [{stepId: "1", name: "myStep", output:["line1"]}]}},
      output: {showOutput:true, buildId: 1, stepId: "1"}
    };
    const expected = {buildId: 1, stepId: "1", stepName: "myStep", output: ["line1"], showOutput: true};

    expect(subject.mapStateToProps(state)).toEqual(expected);
  });

});
