/* globals describe expect it jest beforeEach afterEach */
jest.mock("../../main/actions/OutputActions.es6");
jest.mock("../../main/actions/BuildDetailActions.es6");
jest.mock("../../main/actions/BuildStepActions.es6");
jest.mock("../../main/DevToggles.es6");
jest.mock("../../main/steps/InterestingStepFinder.es6");
import React from "react";
import ToolsRedux, {
    Tools,
    ToolboxLink,
    SHOW_OUTPUT_ICON_CLASS,
    SHOW_SUBSTEP_ICON_CLASS,
    SHOW_INTERESTING_STEP_ICON_CLASS
} from "newSteps/Tools.es6";
import {shallow, mount} from "enzyme";
import {MockStore} from "../testsupport/TestSupport.es6";
import {showBuildOutput} from "actions/OutputActions.es6";
import {toggleStepToolbox, openSubsteps} from "actions/BuildStepActions.es6";
import DevToggles from "../../main/DevToggles.es6";
import {findParentOfFailedSubstep, findParentOfRunningSubstep} from "steps/InterestingStepFinder.es6";

DevToggles.handleTriggerSteps = true;

const fn = () => {
};

describe("Tools", () => {

    describe("ToolboxLink", () => {
        const toolBoxLink = shallow(<ToolboxLink
            toolClass={"someTool"}
            iconClass={"iconCss"}
            linkFn={fn}
            linkText={"Link Text"}/>);

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
            expect(SHOW_INTERESTING_STEP_ICON_CLASS).toEqual("fa-arrow-circle-down");
        });
    });

    describe("Tools", () => {
        const tools = (toolboxOpen = false, hasSubsteps = false, failureStep = null, stepType = "", stepTrigger = null) =>
            <Tools toolboxOpen={toolboxOpen}
                   hasSubsteps={hasSubsteps}
                   failureStep={failureStep}
                   runningStep={[""]}
                   stepType={stepType}
                   stepTrigger={stepTrigger}
                   openSubstepFn={fn}
                   showOutputFn={fn}
                   toggleStepToolboxFn={fn}
                   toggleParallelStepFn={fn}
                   showTriggerDialogFn={fn}/>;

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

            it("should render output and substep tool if step have substeps", () => {
                const component = mount(tools(false, true));
                expect(component.find(".outputTool").length).toBe(1);
                expect(component.find(".substepTool").length).toBe(1);
            });

            describe("trigger Tool", () => {
                it("should render TriggerTool", () => {
                    const component = mount(tools(false, false, null, "trigger", {url: "someURL"}));
                    expect(component.find(".triggerStepTool").length).toBe(1);
                });

                it("should not render expand arrow if step is trigger step", () => {
                    const component = shallow(tools(false, false, null, "trigger", {url: "someURL"}));
                    expect(component.find(".showNoIcon").length).toBe(1);
                });
            });
        });

        describe("Wiring", () => {
            const substeps = {stepId: "1-1", state: "failure"};
            const defaultStep = {stepId: "1", state: "failure", steps: substeps};
            const tools = (storeMock, step = defaultStep) => <ToolsRedux buildId={1} step={step} store={storeMock} />;

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
                openSubsteps.mockReturnValue({type: "goIntoStep"});

                const component = mount(tools(storeMock));
                component.find(".substepTool").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "goIntoStep"});
            });

            it("should dispatch goIntoFailureStep", () => {

                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                openSubsteps.mockReturnValue({type: "goIntoFailureStep"});
                findParentOfFailedSubstep.mockReturnValue(["1"]);

                const component = mount(tools(storeMock));
                component.find(".failureStepTool").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "goIntoFailureStep"});
            });

            it("should dispatch goIntoRunningStep", () => {
                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                openSubsteps.mockReturnValue({type: "goIntoRunningStep"});
                findParentOfRunningSubstep.mockReturnValue(["1"]);

                const component = mount(tools(storeMock, {stepId: "1", state: "running", steps: {stepId: "1-1", state: "running"}}, "1-1"));
                component.find(".runningStepTool").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "goIntoRunningStep"});
            });

            it("should dispatch toggleToolbox", () => {
                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                toggleStepToolbox.mockReturnValue({type: "toggleToolbox"});

                const component = mount(tools(storeMock));
                component.find(".expandTools").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "toggleToolbox"});
            });

            it("should not call toggleToolbox if step is triggerStep", () => {
                const dispatchMock = jest.fn();
                const storeMock = MockStore({config: {baseUrl: ""}}, dispatchMock);

                const component = mount(tools(storeMock, {
                    stepId: 1,
                    state: "waiting",
                    type: "trigger",
                    trigger: {url: "someURL"}
                }));
                component.find(".expandTools").simulate("click");

                expect(dispatchMock).not.toBeCalled();

            });
        });
    });
});