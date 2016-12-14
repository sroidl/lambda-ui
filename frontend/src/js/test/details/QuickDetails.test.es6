/* globals describe it expect beforeEach afterEach */
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {QuickDetails, mapStateToProps} from "details/QuickDetails.es6";
import {shallow} from "enzyme";
import React from "react";

describe("QuickDetails", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("Rendering", () => {
        const steps = [{stepId: 1}];
        const component = shallow(<QuickDetails buildId={1} steps={steps} />);

        it("should render QuickDetails", () => {
            expect(component.find(".quickDetails").length).toBe(1);
        });

        it("should render QuickDetails Title", () => {
            expect(component.find(".quickTitle").length).toBe(1);
        });
    });

    describe("mapStateToProps", () => {

        it("should return ownProps", () => {
            const oldState = {buildDetails: {1: {steps: []}}};

            const ownProps = mapStateToProps(oldState, {buildId: 1, maxDepth: 1});

            expect(ownProps).toEqual({buildId: 1, maxDepth: 1, steps: []});
        });
    });

});