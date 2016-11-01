/* globals describe it expect*/
// import { Header } from '../Header.es6'
import React from "react";
import {HeaderLinks} from "Header.es6";

describe("Header", ()=>{
    it("should show pipeline name from configuration", ()=> {
   // TODO -- how to handle .png and .sass in tests?
    });
});

describe("Navbar Links", () => {
    it("should return one html link", () => {
        const component = HeaderLinks([{url:"http://", name:"Link"}]);
        expect(component).toEqual(<div><a href="http://">Link</a></div>);
    });

    it("should return two html links", () => {
        const component = HeaderLinks([{url:"http://", name:"Link1"}, {url:"https://", name:"Link2"}]);
        expect(component).toEqual(<div><a href="http://">Link1</a><a href="https://">Link2</a></div>);
    });

    it("should return emty div, when no url available", () => {
        const component = HeaderLinks([]);
        expect(component).toEqual(<div></div>);
    });
})
