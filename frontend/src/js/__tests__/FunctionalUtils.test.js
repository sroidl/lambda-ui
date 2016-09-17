/* globals describe it expect */
import * as subject from "../FunctionalUtils.es6";

describe("FunctionalUtils: mapTree", () => {
  it("should return mapped tree", () => {
    const input = {id: 1, name: "root", steps:[
      {id: 2, name: "wurst", steps: [
        {id: 3, name: "kaese"},
        {id: 4, name: "brot", steps: [
          {id: 5, name: "pumpernickel"}
        ]}
      ]}
    ]};

    const expected = {id: 1, name: "root", steps: [
      {id: 2, steps: [
        {id: 3},
        {id: 4, steps: [
          {id: 5}
        ]}
      ]}
    ]};

    const mp = step => {return {id: step.id, steps: step.steps};};
    expect(subject.mapTree(mp)(input)).toEqual(expected);
  });
});
