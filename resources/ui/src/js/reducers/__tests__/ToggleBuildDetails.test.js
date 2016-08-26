import { newToggleBuildDetailsAction } from '../../Actions.es6'
import ToggleBuildDetailsReducer from '../ToggleBuildDetails.es6'

describe("toggleBuildDetailsAction", () =>
  it("should create a proper action", () =>
    expect(newToggleBuildDetailsAction(2)).toEqual({type:"toggleBuildDetails", buildId: 2})))

describe("ToggleBuildDetailsReduce", () => {
  it("should return true for a new buildId if ToggleBuildDetailsAction received", () =>{
    let action = newToggleBuildDetailsAction(3);
    expect(ToggleBuildDetailsReducer({}, action)).toEqual({3: true})})
  it("fd", () =>{
    let action = newToggleBuildDetailsAction(3);
    expect(ToggleBuildDetailsReducer({3: true}, action)).toEqual({3: false})
  })
})
