/* globals describe it expect */
import TriggerReducer from "reducers/BuildStepTrigger.es6";
import {OPEN_TRIGGER_DIALOG, CLOSE_TRIGGER_DIALOG} from "actions/BuildStepTriggerActions.es6";

describe("BuildStepTrigger Reducer",() => {
    describe("Close Trigger Dialog", () => {
        it("should change showTrigger by false", () => {
            const oldState = {showTrigger: true};

            const newState = TriggerReducer(oldState, {type: CLOSE_TRIGGER_DIALOG});

            expect(newState).toEqual({showTrigger: false});
        });
        it("should not change showTrigger if value is false", () => {
            const oldState = {showTrigger: false};

            const newState = TriggerReducer(oldState, {type: CLOSE_TRIGGER_DIALOG});

            expect(newState).toEqual(oldState);
        });
    });

    describe("Open Trigger Dialog", () => {
        it("should change showTrigger by true", () => {
            const oldState = {};

            const newState = TriggerReducer(oldState, {type: OPEN_TRIGGER_DIALOG, url:"url", parameter: []});

            expect(newState).toEqual({showTrigger: true, url: "url", parameter: []});
        });
    });

    it("should return old State f action type is invalid", () => {
        const oldState = {showTrigger: true};

        const newState = TriggerReducer(oldState, {type: "som_other_typ"});

        expect(oldState).toBe(newState);
    });
});