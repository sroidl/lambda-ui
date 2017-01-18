/* globals describe expect it jest beforeEach afterEach */
jest.mock("../../main/actions/OutputActions.es6");
jest.mock("../../main/actions/BuildDetailActions.es6");
jest.mock("../../main/actions/BuildStepActions.es6");
jest.mock("../../main/steps/InterestingStepFinder.es6");
jest.mock("../../main/App.es6");
import React from "react";
import ToolsRedux, {
    Tools,
    ToolboxLink,
    SHOW_OUTPUT_ICON_CLASS,
    SHOW_SUBSTEP_ICON_CLASS,
    SHOW_INTERESTING_STEP_ICON_CLASS,
    TRIGGER_STEP_ICON
} from "../../main/steps/Tools.es6";
import {shallow, mount} from "enzyme";
import {MockStore} from "../testsupport/TestUtils.es6";
import {showBuildOutput} from "../../main/actions/OutputActions.es6";
import {openSubsteps} from "../../main/actions/BuildStepActions.es6";
import {findPathToMostInterestingStep} from "../../main/steps/InterestingStepFinder.es6";
import * as TestUtils from "../../test/testsupport/TestUtils.es6";
import LambdaUIMock from "../../main/App.es6";

const fn = () => {
};

const defaultStep = {stepId: 1};

describe("Tools", () => {

    const realConsole = window.console;

    beforeEach(() => {
        TestUtils.consoleThrowingBefore(realConsole);
    });

    afterEach(() => {
        TestUtils.consoleThrowingAfter(realConsole);
    });

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
        const tools = (toolboxOpen = false, hasSubsteps = false, mostInterestingStep = null, stepType = "", stepTrigger = null, step = defaultStep) =>
            <Tools step={step}
                   toolboxOpen={toolboxOpen}
                   hasSubsteps={hasSubsteps}
                   mostInterestingStep={mostInterestingStep}
                   stepType={stepType}
                   stepTrigger={stepTrigger}
                   killStepFn={fn}
                   retriggerStepFn={fn}
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

            it("should not render Toolbox, if toolboxOpen is false", () => {
                const component = shallow(tools());
                expect(component.find(".toolbox").length).toBe(0);
            });

            it("should render Toolbox, if toolboxOpen is true", () => {
                const component = shallow(tools(true));
                expect(component.find(".toolbox").length).toBe(1);
            });

            it("should not render toggle for toolbox if count of tools lower then 4", () => {
                const component = shallow(tools());
                expect(component.find(".expandTools").length).toBe(0);
            });

            it("should render only show output tool", () => {
                const component = mount(tools());
                expect(component.find(".outputTool").length).toBe(1);
            });

            it("should not render output tool if step is pending", () => {
                const step = {state: "pending"};
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} killStepFn={jest.fn()}/>);

                expect(component.find({toolClass: "outputTool"}).length).toBe(0);

            });

            it("should render kill step tool if step is running", () => {
                const step = {state: "running"};
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} killStepFn={jest.fn()}/>);

                expect(component.find({toolClass: "killStepTool"}).length).toBe(1);
            });

            it("should render kill step tool if step is waiting", () => {
                const step = {state: "waiting"};
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} killStepFn={jest.fn()}/>);

                expect(component.find({toolClass: "killStepTool"}).length).toBe(1);
            });

            it("should not render kill step tool if step is not running or waiting", () => {
                const step = {state: "success"};
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} retriggerStepFn={jest.fn()}/>);

                expect(component.find({toolClass: "killStepTool"}).length).toBe(0);
            });

            it("should call kill fn if clicked", () => {
                const step = {state: "running"};
                const killStepMockFn = jest.fn();
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} killStepFn={killStepMockFn}/>);

                component.find({toolClass: "killStepTool"}).shallow().simulate("click");

                expect(killStepMockFn).toBeCalled();

            });


            it("should render retrigger tool if step is success", () => {
                const step = {state: "success"};
                const retriggerStepMockFn = jest.fn();
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} retriggerStepFn={retriggerStepMockFn}/>);

                expect(component.find({toolClass: "retriggerStepTool"}).length).toBe(1);
            });

            it("should render retrigger tool if step is failed", () => {
                const step = {state: "failure"};
                const retriggerStepMockFn = jest.fn();
                const component = shallow(<Tools step={step} hasSubsteps={false} openSubstepFn={fn} showOutputFn={fn}
                                                 showTriggerDialogFn={fn} stepType="step" toggleStepToolboxFn={fn}
                                                 toolboxOpen={false} retriggerStepFn={retriggerStepMockFn}/>);

                expect(component.find({toolClass: "retriggerStepTool"}).length).toBe(1);
            });

            it("should render output and substep tool if step have substeps", () => {
                const component = mount(tools(false, true));
                expect(component.find(".outputTool").length).toBe(1);
                expect(component.find(".substepTool").length).toBe(1);
            });

            describe("Trigger Tool", () => {

                it("should render TriggerTool", () => {
                    const component = mount(tools(false, false, null, "trigger", {url: "someURL"}));
                    expect(component.find(".triggerStepTool").length).toBe(1);
                });

                it("should not render output button if step has trigger button", () => {
                    const component = mount(tools(false, false, null, "trigger", {url: "someURL"}));
                    expect(component.find(".outputTool").length).toBe(0);
                });

                it("should enable Trigger Tool if step is running", () => {
                    const component = shallow(tools(false, false, null, "trigger", {url: "someURL"}, {state: "running"}));
                    const triggerTool = component.find({iconClass: TRIGGER_STEP_ICON}).shallow();

                    expect(triggerTool.find(".tool").hasClass("disabeld")).toBe(false);
                });

                it("should enable Trigger Tool if step is waiting", () => {
                    const component = shallow(tools(false, false, null, "trigger", {url: "someURL"}, {state: "waiting"}));
                    const triggerTool = component.find({iconClass: TRIGGER_STEP_ICON}).shallow();

                    expect(triggerTool.find(".tool").hasClass("disabeld")).toBe(false);
                });

                it("should disable Trigger Tool if step is not running or waiting", () => {
                    const component = shallow(tools(false, false, null, "trigger", {url: "someURL"}, {state: "success"}));
                    const triggerTool = component.find({iconClass: TRIGGER_STEP_ICON}).shallow();

                    expect(triggerTool.find(".tool").hasClass("disabled")).toBe(true);
                });

            });


        });

        describe("Wiring", () => {
            const substeps = {stepId: "1-1", state: "failure"};
            const defaultStep = {stepId: "1", state: "failure", steps: substeps};
            const tools = (storeMock, step = defaultStep) => <ToolsRedux buildId={1} step={step} store={storeMock}
                                                                         killStepFn={jest.fn()}
                                                                         retriggerStepFn={jest.fn()}/>;

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
                findPathToMostInterestingStep.mockReturnValue({state: "failure", path: ["1"]});

                const component = mount(tools(storeMock));
                component.find(".failureStepTool").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "goIntoFailureStep"});
            });

            it("should dispatch goIntoRunningStep", () => {
                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                openSubsteps.mockReturnValue({type: "goIntoRunningStep"});
                findPathToMostInterestingStep.mockReturnValue({state: "running", path: ["1"]});

                const component = mount(tools(storeMock, {
                    stepId: "1",
                    state: "running",
                    steps: {stepId: "1-1", state: "running"}
                }, "1-1"));
                component.find(".runningStepTool").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "goIntoRunningStep"});
            });

            it("should dispatch goIntoRunningStep", () => {
                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                openSubsteps.mockReturnValue({type: "goIntoWaitingStep"});
                findPathToMostInterestingStep.mockReturnValue({state: "waiting", path: ["1"]});

                const component = mount(tools(storeMock, {
                    stepId: "1",
                    state: "waiting",
                    steps: {stepId: "1-1", state: "waiting"}
                }, "1-1"));
                component.find(".waitingStepTool").simulate("click");

                expect(dispatchMock).toBeCalledWith({type: "goIntoWaitingStep"});
            });


            it("should call killStepFn in backend on killStep click", () => {
                const backendMock = {killStep: jest.fn()};
                LambdaUIMock.backend.mockReturnValue(backendMock);

                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                const component = mount(tools(storeMock, {
                    stepId: "1",
                    state: "running",
                    steps: []
                }));
                component.find(".killStepTool").simulate("click");

                expect(backendMock.killStep).toHaveBeenCalledWith(dispatchMock, 1, "1");

            });

            it("should call triggerStepFn in backend on retriggerStep click", () => {
                const backendMock = {retriggerStep: jest.fn()};
                LambdaUIMock.backend.mockReturnValue(backendMock);

                const dispatchMock = jest.fn();
                const storeMock = MockStore({}, dispatchMock);
                const component = mount(tools(storeMock, {
                    stepId: "1",
                    state: "failure",
                    steps: []
                }));
                component.find(".retriggerStepTool").simulate("click");

                expect(backendMock.retriggerStep).toHaveBeenCalledWith(dispatchMock, 1, "1");
            });

        });
    });
});