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
        expect(component).toEqual(<div className="linksHeader"><a key="http://" href="http://">Link</a></div>);
    });

    it("should return two html links", () => {
        const component = HeaderLinks({links:[{url:"http://", text:"Link1"}, {url:"https://", text:"Link2"}]});
        expect(component).toEqual(<div className="linksHeader"><a key="http://" href="http://">Link1</a><a key="https://" href="https://">Link2</a></div>);
    });


    it("should return emty div, when no url available", () => {
        const component = HeaderLinks({links: []});
        expect(component).toEqual(<div></div>);
    });
});

describe("Header redux", () => {
    it("should get config", () => {
        const state = {config: {name: "Pipline", navbar: {links: [{url: "http...", name: "Name"}]}}};
        const expected = {pipelineName: "Pipline", links: [{url: "http...", name: "Name"}]};
        expect(mapStateToProps(state)).toEqual(expected);
    });
})

