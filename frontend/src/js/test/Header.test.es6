/* globals describe it expect afterEach beforeEach jest */
jest.mock("../main/DevToggles.es6");
import React from "react";
import {Header, HeaderLinks, mapStateToProps} from "Header.es6";
import * as TestUtils from "../test/testsupport/TestUtils.es6";
import {shallow} from "enzyme";
import R from "ramda";
import DevToggleMock from "DevToggles.es6";

DevToggleMock.showPipelineTour = false;

describe("Header", () => {

    let realConsole;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

    const wrapDefaultValues = (input) => R.merge({showStartBuildButton: true}, input);

    describe("start build button", () => {
        it("should show start build button", () => {
            const component = shallow(<Header pipelineName={"Test"} showStartBuildButton={true} links={[]}/>);
            expect(component.find(".runButton").length).toBe(1);
        });

        it("should hide start build button", () => {
            const component = shallow(<Header pipelineName={"Test"} showStartBuildButton={false} links={[]}/>);
            expect(component.find(".runButton").length).toBe(0);
        });
    });

    describe("Navbar Links", () => {
        it("should return one html link", () => {
            const component = HeaderLinks({links: [{url: "http://", text: "Link"}]});
            expect(component).toEqual(<div className="linksHeader"><a target="_blank" key="http://"
                                                                      href="http://">Link</a></div>);
        });

        it("should return two html links", () => {
            const component = HeaderLinks({links: [{url: "http://", text: "Link1"}, {url: "https://", text: "Link2"}]});
            expect(component).toEqual(<div className="linksHeader"><a target="_blank" key="http://"
                                                                      href="http://">Link1</a><a target="_blank"
                                                                                                 key="https://"
                                                                                                 href="https://">Link2</a>
            </div>);
        });


        it("should return null, when emty array in links available", () => {
            const component = HeaderLinks({links: []});
            expect(component).toEqual(null);
        });

        it("should return null, wenn no links in state available", () => {
            const component = HeaderLinks();
            expect(component).toEqual(null);
        });

        it("should set link target correct", () => {
            const component = HeaderLinks({links: [{url: "http://", text: "Link", target: "someTarget"}]});
            expect(component).toEqual(<div className="linksHeader"><a target="someTarget" key="http://"
                                                                      href="http://">Link</a></div>);
        });

        it("should set link target to _blank if key does not exist", () => {
            const component = HeaderLinks({links: [{url: "http://", text: "Link"}]});
            expect(component).toEqual(<div className="linksHeader"><a target="_blank" key="http://"
                                                                      href="http://">Link</a></div>);
        });

    });

    describe("Header redux", () => {
        it("should get config", () => {
            const state = {config: {name: "Pipeline", navbar: {links: [{url: "http...", name: "Name"}]}}};
            const expected = wrapDefaultValues({pipelineName: "Pipeline", links: [{url: "http...", name: "Name"}]});
            expect(mapStateToProps(state)).toEqual(expected);
        });

        it("should get emty array for links, when no links available", () => {
            const state = {config: {name: "Pipeline", navbar: {}}};
            const expected = wrapDefaultValues({pipelineName: "Pipeline", links: []});
            expect(mapStateToProps(state)).toEqual(expected);
        });

        it("should get emty array for links, when no navbar available", () => {
            const state = {config: {name: "Pipeline"}};
            const expected = wrapDefaultValues({pipelineName: "Pipeline", links: []});
            expect(mapStateToProps(state)).toEqual(expected);
        });
    });
});



