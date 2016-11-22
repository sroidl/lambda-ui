/* globals describe it expect */
import {toggleParentSteps} from "actions/BuildDetailBreadcrumbActions.es6";

describe("BuildDetailsBreadcrumbActions", () => {

    it("should return toggleParentSteps action object", () => {
        const newAction = toggleParentSteps(1, "1");
        expect(newAction).toEqual({type: "toggleParentSteps",
            buildId: 1});
    });
});
