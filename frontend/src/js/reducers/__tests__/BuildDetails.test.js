/* globals describe it expect */
/* eslint-disable */
import {BuildDetailsReducer as subject, ViewBuildStepReducer as viewReducer} from '../BuildDetails.es6'
import {ADD_BUILD_DETAILS, VIEW_BUILD_STEP, ADD_BUILDSTEP_OUTPUT} from '../../Actions.es6'

describe("BuildDetailReducer", ()=>{
  it("should return oldState if no ADD_BUILD_DETAILS action was emitted", ()=>{
    let oldState = {};

    let newState = subject(oldState, {type: "nonsense"});

    expect(newState).toBe(oldState);
  });
  it("should add a new detail entry if ADD_BUILD_DETAILS was emitted", ()=>{
    let oldState = {1: {bar: "foo"}};

    let newState = subject(oldState, {type: ADD_BUILD_DETAILS, buildId: 42, buildDetails: {foo: "bar"}})

    expect(newState).toEqual({1: {bar: "foo"}, 42: {foo: "bar"}})
  })
})

describe("ViewBuildStepReducer", () =>{
  it("should return oldState if no VIEW_BUILD_STEP action was emitted", ()=>{
    let oldState = {};

    let newState = viewReducer(oldState, {type: "nonsense"});

    expect(newState).toBe(oldState);
  });
  it("should add a new detail entry if ADD_BUILD_DETAILS was emitted", ()=>{
    let oldState = {1: {bar: "foo"}};

    let newState = viewReducer(oldState, {type: VIEW_BUILD_STEP, buildId: 42, stepId: 2})

    expect(newState).toEqual({1: {bar: "foo"}, 42: 2})
  })
})

/* eslint-enable */

describe("BuildDetailsReducer: addBuildstepOutput", () => {
  it("should ignore update if step unknown", () => {
    const oldState = {};

    expect(subject(oldState, {type: ADD_BUILDSTEP_OUTPUT, buildId: 1, stepId: 1})).toBe(oldState);
  });

  it("should add output to step if no output existed before.", () => {
    const oldState = {1: {steps: [{stepId: 1, steps: [{stepId: 2}]}]}};
    const action = {type: ADD_BUILDSTEP_OUTPUT, buildId: 1, stepId: 2, output: ["output"]};
    const expected = {1: {steps: [{stepId: 1, steps: [{stepId: 2, output: ["output"]}]}]}};

    expect(subject(oldState, action)).toEqual(expected);
  });

  it("should append output to step if output existed before.", () => {
    const oldState = {1: {steps: [{stepId: 1, steps: [{stepId: 2, output: ["line 1"]}]}]}};
    const action = {type: ADD_BUILDSTEP_OUTPUT, buildId: 1, stepId: 2, output: ["line 2"]};
    const expected = {1: {steps: [{stepId: 1, steps: [{stepId: 2, output: ["line 1", "line 2"]}]}]}};

    expect(subject(oldState, action)).toEqual(expected);
  });
});
