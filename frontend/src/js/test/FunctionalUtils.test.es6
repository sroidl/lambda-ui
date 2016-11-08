/* globals describe it expect */
import * as subject from "FunctionalUtils.es6";

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

describe("getFlatTree", () => {
  it("should return flat tree", () => {
    const input = {buildId: 1, subElements: [{name: "element1", subElements: [{name: "element1-1"}]}
                  ,{name: "element2", subElements: [{name: "element2-1"}]}]};
    const expected = [{name: "element1", subElements: [{name: "element1-1"}]}, {name: "element1-1"},
                    {name: "element2", subElements: [{name: "element2-1"}]}, {name: "element2-1"}];
    expect(subject.getFlatTree(input, "subElements")).toEqual(expected);
  });
});