/* globals describe it expect beforeEach afterEach */
import {calculateStepColor} from "newSteps/ColorCalculator.es6";

describe("ColorCalculator", () => {

    describe("calculateStepColor", () => {

        const createState = steps => {return {buildDetails: {1: {steps: steps}}}};

        it("should return whiteStep class if no substeps available", () => {
            const state = createState([
                {stepId: "1", name: "StepName", parentId: "root"}
            ]);

            const colorClass = calculateStepColor(state, 1, "1");

            expect(colorClass).toEqual("StepWhite");
        });

        it("should return stepLevel1 class", () => {
           const state = createState([
               {stepId: "1", name: "StepName", parentId: "root", steps: [
                   {stepId: "1-1", name: "StepName", parentId: "1"}
               ]}
           ]);

            const colorClass = calculateStepColor(state, 1, "1");

            expect(colorClass).toEqual("StepLevel1");
        });

        it("should return stepLevel2 class", () => {
            const state = createState([
                {stepId: "1", name: "StepName", parentId: "root", steps: [
                    {stepId: "1-1", name: "StepName", parentId: "1", steps: [
                        {stepId: "1-1-1", name: "StepName", parentId: "1-1"}
                    ]}
                ]}
            ]);

            const colorClass = calculateStepColor(state, 1, "1-1");

            expect(colorClass).toEqual("StepLevel2");
        });

        it("should return stepLevel3 class", () => {
            const state = createState([
                {stepId: "1", name: "StepName", parentId: "root", steps: [
                    {stepId: "1-1", name: "StepName", parentId: "1", steps: [
                        {stepId: "1-1-1", name: "StepName", parentId: "1-1", steps: [
                            {stepId: "1-1-1-1", name: "StepName", parentId: "1-1-1"}
                        ]}
                    ]}
                ]}
            ]);

            const colorClass = calculateStepColor(state, 1, "1-1-1");

            expect(colorClass).toEqual("StepLevel3");
        });

    });

});