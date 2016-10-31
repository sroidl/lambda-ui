/* globals describe it expect */
/* eslint-disable */
import {BuildDetailsReducer as subject, ViewBuildStepReducer as viewReducer} from "reducers/BuildDetails.es6";
import {ADD_BUILD_DETAILS} from "Actions.es6";
import {VIEW_BUILD_STEP} from "actions/BuildDetailActions.es6";

describe("BuildDetailReducer", ()=>{
  it("should return oldState if no ADD_BUILD_DETAILS action was emitted", ()=>{
    let oldState = {};

    let newState = subject(oldState, {type: "nonsense"});

    expect(newState).toBe(oldState);
  });
  it("should add a new detail entry if ADD_BUILD_DETAILS was emitted", ()=>{
    let oldState = {1: {bar: "foo"}};

    let newState = subject(oldState, {type: ADD_BUILD_DETAILS, buildId: 42, buildDetails: {foo: "bar"}})

    expect(newState).toEqual({1: {bar: "foo"}, 42: {foo: "bar"}});
  });
});

describe("ViewBuildStepReducer", () =>{
  it("should return oldState if no VIEW_BUILD_STEP action was emitted", ()=>{
    let oldState = {};

    let newState = viewReducer(oldState, {type: "nonsense"});

    expect(newState).toBe(oldState);
  });
  it("should add a new detail entry if ADD_BUILD_DETAILS was emitted", ()=>{
    let oldState = {1: {bar: "foo"}};

    let newState = viewReducer(oldState, {type: VIEW_BUILD_STEP, buildId: 42, stepId: 2});

    expect(newState).toEqual({1: {bar: "foo"}, 42: 2});
  });
});

/* eslint-enable */
