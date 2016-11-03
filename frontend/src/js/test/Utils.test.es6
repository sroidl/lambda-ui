/* global describe it expect */
import * as subject from "Utils.es6";

describe("Utils | flatSteps", () => {
    it("should return empty array if no step is provided", () => {
        expect(subject.flatSteps()).toEqual([]);
    });

    it("should return empty if no substeps is given and input has no stepId", () => {
        expect(subject.flatSteps({buildId: 1, steps: []})).toEqual([]);
    });

    it("should input if no substeps are given and stepId exist", () => {
        const input = {stepId: "1"};

        expect(subject.flatSteps(input)).toEqual([input]);
    });

    it("should return input and its substeps if input has stepId", () => {
        const input = {stepId: "1", steps: [{stepId: "1.1"}]};

        expect(subject.flatSteps(input)).toEqual([{stepId: "1", steps: [{stepId: "1.1"}]}, {stepId: "1.1"}]);
    });

    it("should return all substeps in all depth", () => {
        const invalid = {no: "stepId"};
        const step = {stepId: "0"};
        const stepA = {stepId: "1.sub.sub"};
        const stepB = {stepId: "1.sub", steps: [stepA]};
        const stepC = {stepId: "1", steps: [stepB, stepB]};
        const input = {buildId: 1, steps: [stepC, step, invalid, step]};

        expect(subject.flatSteps(input)).toEqual([stepC, stepB, stepA, stepB, stepA, step, step]);
    });


});