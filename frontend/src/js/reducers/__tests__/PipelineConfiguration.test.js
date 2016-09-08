import {PipelineConfigurationReducer as subject} from '../PipelineConfiguration.es6';

describe("PipelineConfigurationReducer", () =>{
  it("should return oldState if no Add configuraiton action was emitted", ()=>{
    let oldState = {old: "state"};

    let newState = subject(oldState, {type: "invalid"});

    expect(newState).toBe(oldState);
  })

  it("should add the pipeline name to the state", ()=> {
      let expected = {name: "myPipeline"};
      let oldState = {old:"state"};

      let newState = subject(oldState, {type: "addConfiguration", config: {name: "myPipeline"}});

      expect(newState).toEqual(expected);
      expect(newState).not.toBe(oldState);
  });
});
