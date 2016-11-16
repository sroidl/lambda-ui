/* eslint-disable */
import {BuildSummary} from "BuildSummary.es6";
import * as subject from "BuildSummary.es6";
import {shallow} from "enzyme";
import React from "react";

function buildIcon(domElement) {
    return domElement.find(".buildIcon").find(".fa");
}

const fn = () => {
};
const time = {};

const buildSummary = ({buildId = 1, state = "running", startTime = "time", toggleBuildDetails = fn}) => {
    return <BuildSummary buildId={buildId} state={state}
                         startTime={startTime}
                         toggleBuildDetails={toggleBuildDetails}
                         buildNumber={1}/>;
};

describe("Build Summary", () => {

    let realConsole;

    beforeEach(() => {
        const consoleThrowing = {
            error: (...args) => {
                realConsole.error("Got errors on console: ", args);
                throw new Error(args);
            },
            log: (...args) => {
                realConsole.log(args);
            }
        };
        realConsole = window.console;
        window.console = consoleThrowing;
    });

    afterEach(() => {
        window.console = realConsole;
    });

    describe("BuildSummary Toggle", () => {
        it("should call the toggle details function on click", () => {
            const toggleFnMock = jest.fn();
            const inputProps = {buildId: 1, toggleBuildDetails: toggleFnMock};

            const component = shallow(buildSummary(inputProps));
            component.find(".buildInfo").simulate("click");

            expect(toggleFnMock).toBeCalled();
        });
    });

    describe("BuildSummary redux mapping", () => {
        it("should map to props properly", () => {
            const state = {
                summaries: {1: {buildId: 1, buildNumber: 12, state: "running", endTime: "10min", startTime: "12sec"}},
                openedBuilds: {1: true},
                buildDetails: {},
                developmentToggles: {useInterestingStep: false}
            };

            const props = subject.mapStateToProps(state, {
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
                open: true,
                useInterestingStep: false
            });

        });
    });

});