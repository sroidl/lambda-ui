import {BuildSummariesReducer as subject} from '../BuildSummaries.es6';
import {addBuildSummary as action} from '../../Actions.es6'

const defaultBuild = buildInfo => Object.assign({state: "myState", buildNumber: "1", startTime: "2015-01-25"}, buildInfo);

describe("BuildSummariesReducer", ()=> {
  it("should reduce the old state if no summary action is given", ()=> {
    const oldState = {old: "state"};

    const newState = subject(oldState, {type: "wrongType"});

    expect(newState).toBe(oldState);
  })
  it("should add a new build summary to the state", ()=>{
    const oldState = {};

    const newState = subject(oldState, action([defaultBuild({buildId:1})]));

    expect(newState).toEqual({1: defaultBuild({buildId:1})});
    expect(newState).not.toBe(oldState);
  })
  it("should add build without changing existing builds", () => {
    const oldState = {1: defaultBuild({buildId: 1})};

    const newState = subject(oldState, action([defaultBuild({buildId: 2})]));

    expect(newState).toEqual({1: defaultBuild({buildId: 1}), 2: defaultBuild({buildId: 2})});
    expect(newState).not.toBe(oldState);
  })

  it("should reject build if buildId is NaN", ()=>{
    const oldState ={};

    const newState = subject(oldState, action([defaultBuild({buildId: "wrong"}), defaultBuild({buildId: 25})]));

    expect(newState).toEqual({25: defaultBuild({buildId: 25})});
  })

  it("should reject if startTime is not an IsoDateString", ()=>{
    const oldState = {};

    const newState = subject(oldState, action([defaultBuild({buildId: 1, startTime:"wrong"})]));

    expect(newState).toEqual(oldState);
  })
});
