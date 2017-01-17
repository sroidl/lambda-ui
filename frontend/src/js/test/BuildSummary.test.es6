/* globals describe it expect beforeEach afterEach jest */
/* eslint-disable */
jest.mock("../main/DevToggles.es6");
import {BuildSummary, mapStateToProps} from "../main/BuildSummary.es6";
import {shallow} from "enzyme";
import React from "react";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

const fn = () => {
};

const buildSummary = (buildId = 1, toggleBuildDetails = fn, state, startTime, endTime, duration) => {
    return <BuildSummary buildId={buildId} state={state}
                         startTime={startTime}
                         toggleBuildDetails={toggleBuildDetails}
                         endTime={endTime}
                         buildNumber={1}
                         duration={duration}/>;
};

describe("Build Summary", () => {

    let realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("BuildSummary Toggle", () => {
        it("should call the toggle details function on click", () => {
            const toggleFnMock = jest.fn();

            const component = shallow(buildSummary(1, toggleFnMock, "latte", "schnuppe", "peter", 1));
            component.find(".buildInfo").simulate("click");

            expect(toggleFnMock).toBeCalled();
        });
    });

    describe("BuildSummary redux mapping", () => {
        it("should map to props properly", () => {
            const state = {
                summaries: {},
                openedBuilds: {1: true},
                buildDetails: {}
            };

            const props = mapStateToProps(state, {
                build: {
                    buildId: 1,
                    buildNumber: 12,
                    state: "success",
                    endTime: "10min",
                    startTime: "12sec",
                    duration: 42
                }
            });

            expect(props).toEqual({
                buildId: 1,
                buildNumber: 12,
                state: "success",
                endTime: "10min",
                startTime: "12sec",
                duration: 42,
                open: true
            });

        });
    });

    describe("Duration", () => {
        it("should render minutes correctly", () => {
            const actual = shallow(buildSummary(1, fn, "running", "2017-01-04T14:50:00Z", "2017-01-04T14:53:20Z", 200));
            const formattedDuration = actual.find(".buildDuration").childAt(2).shallow();

            expect(formattedDuration.text()).toBe("03:20");
        });

        it("should render hours correctly", () => {
            const actual = shallow(buildSummary(1, fn, "running", "2017-01-04T14:50:00Z", "2017-01-04T17:53:20Z", 11000));
            const formattedDuration = actual.find(".buildDuration").childAt(2).shallow();

            expect(formattedDuration.text()).toBe("03:03:20");
        });
    });

    describe("Start Time", () => {
        it("should show no time if startTime is nil", () => {
            const actual = shallow(buildSummary(1, fn, "running", null, "2017-01-04T14:53:20Z", 200));
            const startTime = actual.find(".buildStartTime");

            expect(startTime.text()).toBe("Started: not yet started");
            expect(startTime.prop("title")).toBe("not yet started");
        });

        it("should show tooltip with absolute timestamp", () => {
            const actual = shallow(buildSummary(1, fn, "running", "2017-01-04T14:00:00Z", "2017-01-04T14:53:20Z", 200));
            const startTime = actual.find(".buildStartTime")

            expect(startTime.prop("title")).toBe("Wednesday, January 4th 2017, 3:00:00 pm");
        });

    });

});