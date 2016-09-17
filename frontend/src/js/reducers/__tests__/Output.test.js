/* globals describe it expect */
import {OutputReducer as subject} from "../Output.es6";
import {showBuildOutput} from "../../Actions.es6";

describe("Output reducer", () => {
  it("should return oldState if not SHOW_BUILD_OUTPUT action", () => {
      const oldState = {old: "state"};

      expect(subject(oldState, "someaction")).toBe(oldState);
  });

  it("set and override output to build and step of given action", () => {
      const oldState = {buildId: 1, stepId: 12};

      expect(subject(oldState, showBuildOutput(2, 1))).not.toBe(oldState);
      expect(subject(oldState, showBuildOutput(2, 1))).toEqual({showOutput: true, buildId: 2, stepId: 1});
  });
});
