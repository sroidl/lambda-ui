/* globals describe, it, expect */
import {BuildDetailBreadcrumb as subject} from "../BuildDetailBreadcrumb.es6";
import {shallow} from "enzyme";

describe("Breadcrumb presentation", () => {
  it("should show only root if no step is given", () => {

    expect(shallow(subject([])).text()).toEqual(">");

  });
});
