/* eslint-disable */
import {BuildSummary} from "BuildSummary.es6";
import * as subject from "BuildSummary.es6";
import {shallow} from "enzyme";
import React from "react";

function buildIcon(domElement){
  return domElement.find(".buildIcon").find(".fa");
}

const buildSummary = ({buildId, state, startTime, toggleBuildDetails}) => <BuildSummary buildId={buildId} state={state} startTime={startTime} toggleBuildDetails={toggleBuildDetails}/>;

describe("BuildSummary Display", () => {
describe("BuildIcons", () => {
    it("should show correct failed state icon", () => {
    const inputProps = {buildId: 1, state: "failed", startTime: {toISOString: jest.fn()}};

    const component = shallow(buildSummary(inputProps));

    expect(buildIcon(component).hasClass("fa-times")).toBe(true);
  });

    it("should show correct success state icon", () => {
    const inputProps = {buildId: 1, state: "success", startTime: {toISOString: jest.fn()}};

    const component = shallow(buildSummary(inputProps));

    expect(buildIcon(component).hasClass("fa-check")).toBe(true);
  });

    it("should show correct running state icon", () => {
    const inputProps = {buildId: 1, state: "running", startTime: {toISOString: jest.fn()}};

    const component = shallow(buildSummary(inputProps));

    expect(buildIcon(component).hasClass("fa-cog")).toBe(true);
  });
  });
});

describe("BuildSummary Toggle", () => {
  it("should call the toggle details function on click", () => {
    const toggleFnMock = jest.fn();
    const inputProps = {buildId: 1, toggleBuildDetails: toggleFnMock, startTime: {toISOString: jest.fn()}};

    const component = shallow(buildSummary(inputProps));
    component.find(".buildInfo").simulate("click");

    expect(toggleFnMock).toBeCalled();
  });
});

describe("BuildSummary redux mapping", () => {
  it("should map to props properly", () => {
    const state = {summaries: {1: {buildId: 1, buildNumber: 12, state:"running", endTime:"10min", startTime:"12sec"}},
                    openedBuilds: {1: true}};

    const props = subject.mapStateToProps(state, {build: {buildId: 1, buildNumber: 12, state:"success", endTime:"10min", startTime:"12sec"}});

    expect(props).toEqual({
      buildId: 1,
      buildNumber: 12,
      state: "success",
      endTime: "10min",
      startTime: "12sec",
      open: true
    });

  });
});
