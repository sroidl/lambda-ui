/* globals jest describe expect it */
jest.mock("../main/Actions.es6");
jest.mock("../main/actions/BuildDetailActions.es6");
import {showBuildOutput} from "Actions.es6";
import {viewBuildStep} from "actions/BuildDetailActions.es6";
import React from "react";
import {shallow, mount} from "enzyme";
import BuildStepRedux, {BuildStep} from "BuildStep.es6";
import {MockStore} from "./testsupport/TestSupport.es6";


const details = newAttributes => Object.assign({stepId: 1, state: "success", name: "fooStep"}, newAttributes);

describe("BuildStep rendering", () => {
    it("should render all step information", () => {
        const input = details();

        const component = shallow(<BuildStep buildId={1} step={input}/>);

        expect(component.find(".stepName").text()).toEqual("fooStep");
        expect(component.find(".buildStep").hasClass("success")).toBe(true);
    });

    it("should render failed step state", () => {
        const component = shallow(<BuildStep buildId={1} step={details({state: "failed"})}/>);
        expect(component.find(".buildStep").hasClass("failed")).toBe(true);
    });

    it("should render running step state", () => {
        const component = shallow(<BuildStep buildId={1} step={details({state: "running"})}/>);
        expect(component.find(".buildStep").hasClass("running")).toBe(true);
    });

    it("should render pending step state", () => {
        const component = shallow(<BuildStep buildId={1} step={details({state: "pending"})}/>);
        expect(component.find(".buildStep").hasClass("pending")).toBe(true);
    });

    it("should render link if step has substeps", () => {
        const substeps = {steps: [{stepId: "1.1"}]};

        const component = shallow(<BuildStep buildId={1} step={details(substeps)}/>);

        expect(component.find(".goIntoStepLink").length).toBe(1);
    });

    it("should render output link", () => {
        const component = shallow(<BuildStep buildId={1} step={details()}/>);

        expect(component.find(".showOutputLink").length).toBe(1);
    });
});

describe("BuildStep wiring", () => {
    it("should dispatch go into step action on link click", () => {
        const dispatchMock = jest.fn();
        const storeMock = MockStore({}, dispatchMock);
        const substeps = {steps: [{stepId: "1-1"}]};
        viewBuildStep.mockReturnValue({type: "stepInto"});

        const component = mount(<BuildStepRedux buildId={1} step={details(substeps)} store={storeMock}/>);
        component.find(".goIntoStepLink").simulate("click");

        expect(dispatchMock).toBeCalledWith({type: "stepInto"});
    });

    it("should dispatch show output action on link click", () => {
        const dispatchMock = jest.fn();
        const storeMock = MockStore({}, dispatchMock);
        showBuildOutput.mockReturnValue({type: "showOutput"});

        const component = mount(<BuildStepRedux buildId={1} step={details()} store={storeMock}/>);
        component.find(".showOutputLink").simulate("click");

        expect(dispatchMock).toBeCalledWith({type: "showOutput"});
    });
});


