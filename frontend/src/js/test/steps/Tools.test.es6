/* globals describe expect it jest */
jest.mock("../../main/actions/OutputActions.es6");
jest.mock("../../main/actions/BuildDetailActions.es6");
jest.mock("../../main/actions/BuildStepActions.es6");
jest.mock("../../main/DevToggles.es6");
import React from "react";
import ToolsRedux, {Tools, ToolboxLink, SHOW_OUTPUT_ICON_CLASS, SHOW_SUBSTEP_ICON_CLASS, SHOW_FAILURE_STEP_ICON_CLASS} from "steps/Tools.es6";
import {shallow, mount} from "enzyme";
import {MockStore} from "../testsupport/TestSupport.es6";
import {showBuildOutput} from "actions/OutputActions.es6";
import {viewBuildStep} from "actions/BuildDetailActions.es6";
import {toggleStepToolbox} from "actions/BuildStepActions.es6";
import DevToggles from "../../main/DevToggles.es6";

DevToggles.handleTriggerSteps = true;

const fn = () => {};

describe("ToolboxLink", () => {
    const toolBoxLink = shallow(<ToolboxLink toolClass={"someTool"} iconClass={"iconCss"} linkFn={fn()} linkText={"Link Text"} />);
    it("should have correct iconClass", () => {
        expect(toolBoxLink.find(".iconCss").length).toBe(1);
    });

    it("should have correct toolClass", () => {
        expect(toolBoxLink.find(".someTool").length).toBe(1);
    });

    it("should render linkText", () => {
        expect(toolBoxLink.contains("Link Text")).toBe(true);
    });
});

describe("Tools Icons", () => {
    it("should get iconClass for Output Tool", () => {
        expect(SHOW_OUTPUT_ICON_CLASS).toEqual("fa-align-justify");
    });

    it("should get iconClass for Substep Tool", () => {
        expect(SHOW_SUBSTEP_ICON_CLASS).toEqual("fa-level-down");
    });

    it("should get iconClass for FailureStep Tool", () => {
        expect(SHOW_FAILURE_STEP_ICON_CLASS).toEqual("fa-arrow-circle-down");
    });
});

describe("Tools", () => {

    const tools = (toolboxOpen = false, hasSubsteps = false, failureStep = null, stepType = "", stepTrigger = null) =>
        <Tools goIntoFailureStepFn={fn()} goIntoStepFn={fn()} hasSubsteps={hasSubsteps}
               showOutputFn={fn()} toggleStepToolboxFn={fn()} toolboxOpen={toolboxOpen}
               failureStep={failureStep} stepType={stepType} stepTrigger={stepTrigger}/>;

    describe("Rendering", () => {
        it("should render Tools", () => {
            const component = shallow(tools());
            expect(component.find(".tools").length).toBe(1);
        });

        it("should render Toolbar", () => {
            const component = shallow(tools());
            expect(component.find(".toolbar").length).toBe(1);
        });

        it("should not render Toolbox, if tollboxOpen is false", () => {
            const component = shallow(tools());
            expect(component.find(".toolbox").length).toBe(0);
        });

        it("should render Toolbox, if toolboxOpen is true", () => {
            const component = shallow(tools(true));
            expect(component.find(".toolbox").length).toBe(1);
        });

        it("should render toggle for toolbox", () => {
            const component = shallow(tools());
            expect(component.find(".expandTools").length).toBe(1);
        });

        it("should render only show output tool", () => {
            const component = mount(tools());
            expect(component.find(".outputTool").length).toBe(1);
        });

        it("should render output tool in toolbar and toolbox", () => {
            const component = mount(tools(true));
            expect(component.find(".outputTool").length).toBe(2);
        });

        it("should render output and substep tool if step have substeps", () => {
            const component = mount(tools(false, true));
            expect(component.find(".outputTool").length).toBe(1);
            expect(component.find(".substepTool").length).toBe(1);
        });

        it("should render output and substeps in toolbox and toolbar", () => {
            const component = mount(tools(true, true));
            expect(component.find(".outputTool").length).toBe(2);
            expect(component.find(".substepTool").length).toBe(2);
        });

        it("should render output, substeps and failureStep tool in toolbox and toolbar", () => {
            const component = mount(tools(true, true, "1"));
            expect(component.find(".outputTool").length).toBe(2);
            expect(component.find(".substepTool").length).toBe(2);
            expect(component.find(".failureStepTool").length).toBe(2);
        });

        it("should render TriggerTool", () => {
            const component = mount(tools(false,false,null,"trigger", {url: "someURL"}));
            expect(component.find(".triggerStepTool").length).toBe(1);
        });
    });

    describe("Wiring" , () => {
        const substeps = {stepId: "1-1", state: "failure"};
        const tools = (storeMock) => <ToolsRedux buildId={1} failureStep={"1-1"}
                                  step={{stepId: 1, state: "failure", steps:substeps}}
                                  store={storeMock} />;

        it("should dispatch showOutput", () => {
            const dispatchMock = jest.fn();
            const storeMock = MockStore({}, dispatchMock);
            showBuildOutput.mockReturnValue({type: "stepOutput"});

            const component = mount(tools(storeMock));
            component.find(".outputTool").simulate("click");

            expect(dispatchMock).toBeCalledWith({type: "stepOutput"});
        });

        it("should dispatch goIntoSubsteps", () => {
            const dispatchMock = jest.fn();
            const storeMock = MockStore({}, dispatchMock);
            viewBuildStep.mockReturnValue({type: "goIntoStep"});

            const component = mount(tools(storeMock));
            component.find(".substepTool").simulate("click");

            expect(dispatchMock).toBeCalledWith({type: "goIntoStep"});
        });

        it("should dispatch goIntoFailureStep", () => {
            const dispatchMock = jest.fn();
            const storeMock = MockStore({}, dispatchMock);
            viewBuildStep.mockReturnValue({type: "goIntoFailureStep"});

            const component = mount(tools(storeMock));
            component.find(".failureStepTool").simulate("click");

            expect(dispatchMock).toBeCalledWith({type: "goIntoFailureStep"});
        });

        it("should dispatch toggleToolbox", () => {
            const dispatchMock = jest.fn();
            const storeMock = MockStore({}, dispatchMock);
            toggleStepToolbox.mockReturnValue({type: "toggleToolbox"});

            const component = mount(tools(storeMock));
            component.find(".expandTools").simulate("click");

            expect(dispatchMock).toBeCalledWith({type: "toggleToolbox"});
        });
    });
});