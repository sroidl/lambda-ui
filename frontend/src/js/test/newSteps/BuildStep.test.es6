/* globals describe it expect beforeEach afterEach */
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import {mapStateToProps} from "newSteps/BuildStep.es6";

describe("BuildStep", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    describe("mapStateToProps", () => {
        it("should return buildStep props", () => {
            const state = {};
            const ownProps = {buildId: 1, step: {}};

            const newProps = mapStateToProps(state, ownProps);

            expect(newProps).toEqual({hasSubsteps: false, step: {}, isParallel: false, buildId: 1, showSubsteps: true});
        });
    });
});