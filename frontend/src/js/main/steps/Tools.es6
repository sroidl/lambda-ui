import React, {PropTypes} from "react";
import ComponentUtils from "../ComponentUtils.es6";
import {connect} from "react-redux";
import "../../../sass/buildStepTools.sass";
import {showBuildOutput} from "actions/OutputActions.es6";
import {toggleStepToolbox, openSubsteps} from "actions/BuildStepActions.es6";
import {openTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import R from "ramda";
import DevToggle from "../DevToggles.es6";
import {findParentOfFailedSubstep, findParentOfRunningSubstep} from "./InterestingStepFinder.es6";
import LamdbdaUI from "App.es6";
import * as Utils from "../Utils.es6";
import {KILLED_ICON} from "../StateIcon.es6";

export const SHOW_OUTPUT_ICON_CLASS = "fa-align-justify";
export const SHOW_SUBSTEP_ICON_CLASS = "fa-level-down";
export const SHOW_INTERESTING_STEP_ICON_CLASS = "fa-arrow-circle-down";
export const RETRIGGER_STEP_ICON_CLASS = " fa-repeat";
export const TRIGGER_STEP_ICON = "fa-play";

const BUTTONS_PER_ROW = 5;

export const ToolboxLink = ({iconClass, toolClass, linkText, linkFn}) => {
    return <div className={ComponentUtils.classes(toolClass, "tool")} onClick={linkFn}>
        <div className="toolIcon" title={linkText}><i className={ComponentUtils.classes("fa", iconClass)}/></div>
        <div className="linkText">{linkText}</div>
    </div>;
};

ToolboxLink.propTypes = {
    iconClass: PropTypes.string.isRequired,
    toolClass: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    linkFn: PropTypes.func.isRequired
};

export class Tools extends React.Component {

    constructor(props) {
        super(props);
    }

    outputButton() {
        const {stepTrigger} = this.props;

        if (stepTrigger && stepTrigger.url) {
            return null;
        }

        return <ToolboxLink key="outputButton" toolClass="outputTool" iconClass={SHOW_OUTPUT_ICON_CLASS}
                            linkText="Show Output"
                            linkFn={this.props.showOutputFn}/>;
    }

    substepButton() {
        const {step, openSubstepFn, hasSubsteps} = this.props;

        if (!hasSubsteps) {
            return null;
        }

        const linkFn = () => openSubstepFn(step.stepId);
        return <ToolboxLink key="substepButton" toolClass="substepTool" iconClass={SHOW_SUBSTEP_ICON_CLASS}
                            linkText="Substeps" linkFn={linkFn}/>;
    }

    killButton() {
        const {step, killStepFn} = this.props;

        if (DevToggle.showKillStep && Utils.isRunning(step.state)) {
            return <ToolboxLink key="killButton" iconClass={KILLED_ICON} toolClass={"killStepTool"}
                                linkText="Kill Step" linkFn={killStepFn}/>;
        }
        return null;
    }

    retriggerButton() {
        const {step, retriggerStepFn} = this.props;

        if (DevToggle.showRetriggerStep && Utils.isFinished(step.state)) {
            return <ToolboxLink key="retriggerButton" iconClass={RETRIGGER_STEP_ICON_CLASS}
                                toolClass={"retriggerStepTool"} linkText={"Retrigger Step"} linkFn={retriggerStepFn}/>;
        }
        return null;
    }

    jumpToMostInterestingStepButton() {
        const {failureStep, runningStep, openSubstepFn, hasSubsteps} = this.props;

        if ((!failureStep && !runningStep) || !hasSubsteps) {
            return null;
        }

        const linkFn = () => {
            if (runningStep) {
                R.map(stepId => openSubstepFn(stepId))(runningStep);
            } else if (failureStep) {
                R.map(stepId => openSubstepFn(stepId))(failureStep);
            }
        };

        const toolClasses = ComponentUtils.classes("interestingStepTool", runningStep ? "runningStepTool" : "failureStepTool");
        const linkText = runningStep ? "Running Step" : "Failure Step";

        return <ToolboxLink key="jumpToMostInterestingStepButton" toolClass={toolClasses}
                            iconClass={SHOW_INTERESTING_STEP_ICON_CLASS}
                            linkText={linkText} linkFn={linkFn}/>;
    }

    triggerButton() {
        const {stepTrigger, showTriggerDialogFn, step} = this.props;

        if (!stepTrigger || !stepTrigger.url) {
            return null;
        }

        const baseToolClass = "triggerStepTool";
        const enabled = null;
        const disabled = "disabled";
        const toolClasses = ComponentUtils.classes(baseToolClass, Utils.isRunning(R.prop("state", step)) ? enabled : disabled);

        const linkFn = () => showTriggerDialogFn(stepTrigger.url, stepTrigger.parameter || []);
        return <ToolboxLink key="triggerButton" iconClass={TRIGGER_STEP_ICON} toolClass={toolClasses} linkText="Trigger"
                            linkFn={linkFn}/>;
    }

    buttonList() {

        const buttonList = [
            this.triggerButton(),
            this.outputButton(),
            this.jumpToMostInterestingStepButton(),
            this.substepButton(),
            this.killButton(),
            this.retriggerButton()
        ];

        const notNil = R.pipe(R.isNil, R.not);
        return R.filter(notNil)(buttonList);
    }

    smallButtonBar(buttonList) {
        const classes = ComponentUtils.classes("toolbar", buttonList.length <= 3 ? "withoutExpand" : "");

        return <div className={classes}>
            {R.take(BUTTONS_PER_ROW, buttonList)}
        </div>;
    }

    extendedButtonBar(buttonList) {

        if (!this.props.toolboxOpen) {
            return null;
        }

        return <div className="toolbox">
            {R.slice(BUTTONS_PER_ROW, buttonList)}
        </div>;
    }

    toggleButtonBarButton(buttonsToRender) {
        const {toggleStepToolboxFn, toolboxOpen} = this.props;

        if (buttonsToRender.length <= BUTTONS_PER_ROW) {
            return null;
        }

        const toggleToolboxClasses = ComponentUtils.classes("expandTools", "showNoIcon");
        const toggleToolboxIconClasses = ComponentUtils.classes("fa", (toolboxOpen ? "fa-angle-up" : "fa-angle-down"));

        return <div className={toggleToolboxClasses} onClick={toggleStepToolboxFn}>
            <i className={toggleToolboxIconClasses} aria-hidden="true"/>
        </div>;
    }

    render() {
        const buttonList = this.buttonList();
        return <div className="tools">
            {this.smallButtonBar(buttonList)}
            {this.extendedButtonBar(buttonList)}
            {this.toggleButtonBarButton(buttonList)}
        </div>;
    }
}

Tools.propTypes = {
    step: PropTypes.object.isRequired,
    failureStep: PropTypes.array,
    runningStep: PropTypes.array,
    hasSubsteps: PropTypes.bool.isRequired,
    stepType: PropTypes.string.isRequired,
    toolboxOpen: PropTypes.bool.isRequired,
    openSubstepFn: PropTypes.func.isRequired,
    showOutputFn: PropTypes.func.isRequired,
    toggleStepToolboxFn: PropTypes.func.isRequired,
    showTriggerDialogFn: PropTypes.func.isRequired,
    stepTrigger: PropTypes.object,
    killStepFn: PropTypes.func,
    retriggerStepFn: PropTypes.func
};


const enrichTriggerUrl = (triggerData, config) => {
    if (triggerData && config) {
        return R.merge(triggerData, {url: "http://" + config.baseUrl + triggerData.url});
    }
    return null;
};

const mapStateToProps = (state, ownProps) => {
    const hasSubsteps = ownProps.step.steps && ownProps.step.steps.length !== 0 || false;
    const stepType = ownProps.step.type || "";
    const stepTrigger = ownProps.step.trigger || null;
    const enrichedTrigger = enrichTriggerUrl(stepTrigger, state.config);

    return {
        step: ownProps.step,
        failureStep: findParentOfFailedSubstep(state, ownProps.buildId, ownProps.step.stepId),
        runningStep: findParentOfRunningSubstep(state, ownProps.buildId, ownProps.step.stepId),
        hasSubsteps: hasSubsteps,
        stepType: stepType,
        stepTrigger: enrichedTrigger,
        toolboxOpen: R.pathOr(false, [ownProps.buildId, ownProps.step.stepId])(state.showStepToolbox)
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const buildId = ownProps.buildId;
    const stepId = ownProps.step.stepId;
    const stepName = ownProps.step.name;

    return {
        openSubstepFn: (stepId) => dispatch(openSubsteps(buildId, stepId)),
        showOutputFn: () => dispatch(showBuildOutput(buildId, stepId)),
        toggleStepToolboxFn: () => dispatch(toggleStepToolbox(buildId, stepId)),
        showTriggerDialogFn: (url, parameter) => dispatch(openTriggerDialog(url, parameter, stepName)),
        killStepFn: () => LamdbdaUI.backend().killStep(dispatch, buildId, stepId)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);