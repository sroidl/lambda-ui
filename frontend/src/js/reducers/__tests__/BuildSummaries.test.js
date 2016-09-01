import {BuildSummariesReducer as subject} from '../BuildSummaries.es6';
import {addBuildSummary as action} from '../../Actions.es6'

const defaultBuild = buildInfo => Object.assign({state: "running", buildNumber: "1", startTime: "2015-01-25"}, buildInfo);

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


  const shouldReject = build =>{
    const newState = subject({}, action([build]));
    expect(newState).toEqual({});
  }

  const shouldAccept = build =>{
    const newState = subject({}, action([build]));
    let b = {}
    b[build.buildId] = build;
    expect(newState).toEqual(b);
  }

  it("should reject build if buildId is NaN", ()=>{
      shouldReject(defaultBuild({buildId: "nan"}))
  })
  it("should reject if startTime is not an IsoDateString", ()=>{
    shouldReject(defaultBuild({buildId: 1, startTime:"wrong"}));
  })
  it("should reject if duration is set but not a number", ()=>{
    shouldReject(defaultBuild({buildId: 1, duration: "string"}))
  })
  it("should reject abritrary state", ()=>{
    shouldReject(defaultBuild({buildId: 1, state: "wrong"}))
  })
  it("should accept state 'running'", ()=>{
    shouldAccept(defaultBuild({buildId: 1, state: "running"}))
  })
  it("should accept state 'failed'", ()=>{
    shouldAccept(defaultBuild({buildId: 1, state: "failed"}))
  })
  it("should accept state 'failed'", ()=>{
    shouldAccept(defaultBuild({buildId: 1, state: "pending"}))
  })
});
