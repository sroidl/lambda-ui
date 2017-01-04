/* globals describe it expect beforeEach afterEach jest */
/* eslint-disable */
jest.mock("../main/DevToggles.es6");
import {BuildSummary, mapStateToProps} from "BuildSummary.es6";
import {shallow} from "enzyme";
import React from "react";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

const fn = () => {
};

const buildSummary = (buildId = 1, toggleBuildDetails = fn, state = "running", startTime = "time", endTime) => {
    return <BuildSummary buildId={buildId} state={state}
                         startTime={startTime}
                         toggleBuildDetails={toggleBuildDetails}
                         endTime={endTime}
                         buildNumber={1}/>;
};

describe("Build Summary", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("BuildSummary Toggle", () => {
        it("should call the toggle details function on click", () => {
            const toggleFnMock = jest.fn();

            const component = shallow(buildSummary(1, toggleFnMock));
            component.find(".buildInfo").simulate("click");

            expect(toggleFnMock).toBeCalled();
        });
    });

    describe("BuildSummary redux mapping", () => {
        it("should map to props properly", () => {
            const state = {
                summaries: {1: {buildId: 1, buildNumber: 12, state: "running", endTime: "10min", startTime: "12sec"}},
                openedBuilds: {1: true},
                buildDetails: {}
            };

            const props = mapStateToProps(state, {
                build: {
                    buildId: 1,
                    buildNumber: 12,
                    state: "success",
                    endTime: "10min",
                    startTime: "12sec"
                }
            });

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

    describe("Duration", () => {
        it("should render minutes correctly", () => {
            const actual = shallow(buildSummary(1, fn, "running", "2017-01-04T14:50:00Z", "2017-01-04T14:53:20Z"));
            const formattedDuration = actual.find(".buildDuration").childAt(2).shallow();

            expect(formattedDuration.text()).toBe("03:20");
        });

    });

});