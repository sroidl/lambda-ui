/* globals describe it expect afterEach beforeEach */
import {StateIcon} from "../main/StateIcon.es6";
import React from "react";
import * as TestUtils from "../test/testsupport/TestUtils.es6";

describe("State Icon", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    it("should return span with success icon and hint", () => {
        const state = "success";
        const expected = <span className="buildIcon success" title="Success"><i className="fa fa-check"/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return span with failure icon and hint", () => {
        const state = "failure";
        const expected = <span className="buildIcon failure" title="Failure"><i className="fa fa-times"/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return span with running icon and rotate class and hint", () => {
        const state = "running";
        const expected = <span className="buildIcon running" title="Running"><i className="fa fa-cog rotate"/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return span with killed icon and hint", () => {
        const state = "killed";
        const expected = <span className="buildIcon killed" title="Killed"><i className="fa fa-ban"/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return span with default icon and without hint", () => {
        const state = "";
        const expected = <span className="buildIcon " title=""><i className="fa fa-ellipsis-h"/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return span with waiting icon and without hint", () => {
        const state = "waiting";
        const expected = <span className="buildIcon waiting" title="Waiting"><i className="fa fa-ellipsis-h"/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return span with pending icon and without hint", () => {
        const state = "pending";
        const expected = <span className="buildIcon pending" title="Pending"><i className="fa "/></span>;
        expect(StateIcon({state: state})).toEqual(expected);
    });
});