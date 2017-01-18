/* globals describe it expect jest */
jest.mock("../../main/steps/HorizontalScroll.es6");
import {makeDraggable, scrollToStep} from "../../main/steps/HorizontalScroll.es6";

describe("HorizontalScroll", () => {

    it("should check if makeDraggable was called", () => {
        makeDraggable(1);

        expect(makeDraggable).toBeCalled();
    });

    it("should check if scrollToStep was called", () => {
        scrollToStep(1);

        expect(scrollToStep).toBeCalled();
    });
});