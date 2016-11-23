/* globals describe it expect */
import {getStateForFavicon} from "FaviconState.es6";

describe("getStateForFavivon", () => {
    it("should return null if state is emty", () => {
        const newState = {};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual(null);
    });

    it("should return first state if state has one element", () => {
        const newState = {1:{state: "success"}};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual("success");
    });

    it("should return last state of summaries", () => {
        const newState = {1:{state: "success"}, 2:{state: "failure"}};

        const buildState = getStateForFavicon(newState);

        expect(buildState).toEqual("failure");
    });
});