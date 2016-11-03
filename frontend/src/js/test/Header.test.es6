/* globals describe it expect*/
// import { Header } from '../Header.es6'
import React from "react";
import {HeaderLinks, mapStateToProps} from "Header.es6";

describe("Header", ()=>{
    it("should show pipeline name from configuration", ()=> {
   // TODO -- how to handle .png and .sass in tests?
    });
});

describe("Navbar Links", () => {
    it("should return one html link", () => {
        const component = HeaderLinks({links: [{url:"http://", text:"Link"}]});
        expect(component).toEqual(<div className="linksHeader"><a target="_blank"  key="http://" href="http://">Link</a></div>);
    });

    it("should return two html links", () => {
        const component = HeaderLinks({links:[{url:"http://", text:"Link1"}, {url:"https://", text:"Link2"}]});
        expect(component).toEqual(<div className="linksHeader"><a target="_blank"  key="http://" href="http://">Link1</a><a target="_blank"  key="https://" href="https://">Link2</a></div>);
    });


    it("should return null, when emty array in links available", () => {
        const component = HeaderLinks({links: []});
        expect(component).toEqual(null);
    });

    it("should return null, wenn no links in state available", () => {
        const component = HeaderLinks();
        expect(component).toEqual(null);
    });
});

describe("Header redux", () => {
    it("should get config", () => {
        const state = {config: {name: "Pipeline", navbar: {links: [{url: "http...", name: "Name"}]}}};
        const expected = {pipelineName: "Pipeline", links: [{url: "http...", name: "Name"}]};
        expect(mapStateToProps(state)).toEqual(expected);
    });

    it("should get emty array for links, when no links available", () => {
        const state = {config: {name: "Pipeline", navbar: {}}};
        const expected = {pipelineName: "Pipeline", links: []};
        expect(mapStateToProps(state)).toEqual(expected);
    });

    it("should get emty array for links, when no navbar available", () => {
        const state = {config: {name: "Pipeline"}};
        const expected = {pipelineName: "Pipeline", links: []};
        expect(mapStateToProps(state)).toEqual(expected);
    });
})

