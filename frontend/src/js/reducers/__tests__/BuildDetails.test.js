import {BuildDetailsReducer as subject} from '../BuildDetails.es6'
import {ADD_BUILD_DETAILS} from '../../Actions.es6'

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
