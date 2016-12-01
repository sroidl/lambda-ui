/* globals describe it expect beforeEach afterEach */
import {PipelineConfigurationReducer as subject} from "reducers/PipelineConfiguration.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";

describe("PipelineConfigurationReducer", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return oldState if no Add configuraiton action was emitted", () => {
        const oldState = {old: "state"};

        const newState = subject(oldState, {type: "invalid"});

        expect(newState).toBe(oldState);
    });

    it("should add the pipeline name to the state", () => {
        const expected = {name: "myPipeline"};
        const oldState = {old: "state"};

        const newState = subject(oldState, {type: "addConfiguration", config: {name: "myPipeline"}});

        expect(newState).toEqual(expected);
        expect(newState).not.toBe(oldState);
    });
});
