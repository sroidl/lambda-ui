/* globals describe it expect afterEach beforeEach */
import {StateIcon} from "StateIcon.es6";
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

    it("should return div with success icon and hint", () => {
        const state = "success";
        const expected = <div className="buildIcon" title="Success"><i className="fa fa-check"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return div with failure icon and hint", () => {
        const state = "failure";
        const expected = <div className="buildIcon" title="Failure"><i className="fa fa-times"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return div with running icon and rotate class and hint", () => {
        const state = "running";
        const expected = <div className="buildIcon" title="Running"><i className="fa fa-cog rotate"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return div with killed icon and hint", () => {
        const state = "killed";
        const expected = <div className="buildIcon" title="Killed"><i className="fa fa-ban"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return div with default icon and without hint", () => {
        const state = "";
        const expected = <div className="buildIcon" title=""><i className="fa fa-ellipsis-h"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return div with waiting icon and without hint", () => {
        const state = "waiting";
        const expected = <div className="buildIcon" title="Waiting"><i className="fa fa-ellipsis-h"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });

    it("should return div with pending icon and without hint", () => {
        const state = "pending";
        const expected = <div className="buildIcon" title="Pending"><i className="fa fa-ellipsis-h"/></div>;
        expect(StateIcon({state: state})).toEqual(expected);
    });
});