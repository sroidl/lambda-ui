import {BuildSummariesReducer as subject} from '../BuildSummaries.es6';
import {addBuildSummary as action} from '../../Actions.es6'

describe("BuildSummariesReducer", ()=> {
  it("should reduce the old state if no summary action is given", ()=> {
    const oldState = {old: "state"};

    const newState = subject(oldState, {type: "wrongType"});

    expect(newState).toBe(oldState);
  })
  it("should add a new build summary to the state", ()=>{
    const oldState = {};

    const newState = subject(oldState, action([{buildId: 1, test:"summary"}]));

    expect(newState).toEqual({1: {buildId: 1, test: "summary"}});
    expect(newState).not.toBe(oldState);
  })
  it("should add two build summaries at the same time", () => {
    const oldState = {};

    const newState = subject(oldState, action([{buildId: 1, test:"summary"}, {buildId: 2, foo:'bar'}]));

    expect(newState).toEqual({1: {buildId: 1, test: "summary"}, 2: {buildId: 2, foo:'bar'}});
    expect(newState).not.toBe(oldState);
  })
});
