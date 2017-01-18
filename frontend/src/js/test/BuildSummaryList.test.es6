/* globals describe it expect beforeEach afterEach */
import {BuildSummaryList} from "../main/BuildSummaryList.es6";
import {shallow} from "enzyme";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

describe("BuildSummaryList", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should render two summaries", () => {
        const state = {builds: {1: {buildId: 1}, 2: {buildId: 2}}};

        const subject = shallow(BuildSummaryList(state));

        expect(subject.find(".buildSummaryList").children().length).toEqual(2);
    });
});
