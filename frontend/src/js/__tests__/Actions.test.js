import * as Actions from '../Actions.es6';

describe("Actions creators", ()=> {
  it("should create a correct viewBuildStep Action", ()=>{
    let action = Actions.viewBuildStep(1, 2);

    expect(action).toEqual({type: "viewBuildStep", buildId: 1, stepId: 2})
  })
})
