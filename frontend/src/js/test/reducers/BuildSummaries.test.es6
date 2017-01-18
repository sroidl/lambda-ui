/* globals it expect describe beforeEach afterEach */
import {BuildSummariesReducer as subject} from "../../main/reducers/BuildSummaries.es6";
import {addBuildSummary as action, changeBuildSummary} from "../../main/actions/BuildSummaryActions.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

const defaultBuildInput = buildInfo => Object.assign({
    state: "running",
    buildNumber: "1",
    startTime: "2015-01-25"
}, buildInfo);
const defaultBuild = buildInfo => Object.assign({
    state: "running",
    buildNumber: "1",
    startTime: "2015-01-25"
}, buildInfo);

describe("BuildSummaries", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("BuildSummariesReducer: ADD_SUMMARIES", () => {
        it("should reduce the old state if no summary action is given", () => {
            const oldState = {old: "state"};

            const newState = subject(oldState, {type: "wrongType"});

            expect(newState).toBe(oldState);
        });
        it("should add a new build summary to the state", () => {
            const oldState = {};

            const newState = subject(oldState, action([defaultBuildInput({buildId: 1})]));

            expect(newState).toEqual({1: defaultBuild({buildId: 1})});
            expect(newState).not.toBe(oldState);
        });
        it("should add build without changing existing builds", () => {
            const oldState = {1: defaultBuild({buildId: 1})};

            const newState = subject(oldState, action([defaultBuildInput({buildId: 2})]));

            expect(newState).toEqual({1: defaultBuild({buildId: 1}), 2: defaultBuild({buildId: 2})});
            expect(newState).not.toBe(oldState);
        });


        const shouldReject = build => {
            const newState = subject({}, action([build]));
            expect(newState).toEqual({});
        };

        const shouldAccept = build => {
            const newState = subject({}, action([build]));
            const b = {};
            b[build.buildId] = build;
            expect(newState).toEqual(b);
        };

        it("should reject build if buildId is NaN", () => {
            shouldReject(defaultBuild({buildId: "nan"}));
        });
        it("should reject if startTime is not an IsoDateString", () => {
            shouldReject(defaultBuild({buildId: 1, startTime: "wrong"}));
        });
        it("should reject if duration is set but not a number", () => {
            shouldReject(defaultBuild({buildId: 1, duration: "string"}));
        });
        it("should reject abritrary state", () => {
            shouldReject(defaultBuild({buildId: 1, state: "wrong"}));
        });
        it("should accept state 'running'", () => {
            shouldAccept(defaultBuild({buildId: 1, state: "running"}));
        });
        it("should accept state 'failed'", () => {
            shouldAccept(defaultBuild({buildId: 1, state: "failed"}));
        });
        it("should accept state 'pending'", () => {
            shouldAccept(defaultBuild({buildId: 1, state: "pending"}));
        });
        it("should accept state 'success'", () => {
            shouldAccept(defaultBuild({buildId: 1, state: "success"}));
        });
        it("should accept state 'killed'", () => {
            shouldAccept(defaultBuild({buildId: 1, state: "killed"}));
        });
    });

    describe("BuildSummariesReducer: CHANGE_SUMMARY", () => {
        it("should return oldState if buildId does not exist", () => {
            const oldState = {};

            const newState = subject(oldState, changeBuildSummary(1, {}));

            expect(newState).toBe(oldState);
        });
        it("should change existing summary, keeping attributes that are not in changeobject", () => {
            const oldState = {1: defaultBuild({buildId: 1})};
            const expected = defaultBuild({buildId: 1, duration: 1});

            const newState = subject(oldState, changeBuildSummary(1, {duration: 1}));

            expect(newState[1]).toEqual(expected);
            expect(newState[1]).not.toBe(oldState[1]);
        });
        it("should reject change summary that leads to invalid state", () => {
            const oldState = {1: defaultBuild({buildId: 1})};

            const newState = subject(oldState, changeBuildSummary(1, {state: "wrongNewState"}));

            expect(newState).toBe(oldState);
        });
    });
});
