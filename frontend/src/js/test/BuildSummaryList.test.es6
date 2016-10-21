import {BuildSummaryList} from "BuildSummaryList.es6";
import {shallow} from "enzyme";

describe("BuildSummaryList", () =>{
  it("should render two summaries", ()=>{
    let state = {builds: {1: {buildId: 1}, 2: {buildId:2}}}

    let subject = shallow(BuildSummaryList(state));

    expect(subject.find(".buildSummaryList").children().length).toEqual(2);
  })
})
