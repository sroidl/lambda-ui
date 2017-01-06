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

export const SHOW_OUTPUT_ICON_CLASS = "fa-align-justify";
export const SHOW_SUBSTEP_ICON_CLASS = "fa-level-down";
export const SHOW_INTERESTING_STEP_ICON_CLASS = "fa-arrow-circle-down";
export const KILL_STEP_ICON_CLASS = " fa-stop-circle-o";
export const TRIGGER_STEP_ICON = "fa-play";

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

    toolOutput() {
        return <ToolboxLink key="outputTool" toolClass="outputTool" iconClass={SHOW_OUTPUT_ICON_CLASS} linkText="Show Output"
                            linkFn={this.props.showOutputFn}/>;
    }

    toolSubstep() {
        const {step, openSubstepFn} = this.props;

        const linkFn = () => openSubstepFn(step.stepId);
        return <ToolboxLink key="substepTool" toolClass="substepTool" iconClass={SHOW_SUBSTEP_ICON_CLASS}
                                linkText="Substeps" linkFn={linkFn}/>;
    }

    toolKillStep() {
        const {step, killStepFn} = this.props;

        const linkFn = killStepFn;

        if(DevToggle.showKillStep && step.state === "running") {
            return <ToolboxLink iconClass={KILL_STEP_ICON_CLASS} toolClass={"killStepTool"} linkText="Kill Step" linkFn={linkFn}/>;
        }
        return null;
    }

    toolInterestingStep() {
        const {failureStep, runningStep, openSubstepFn} = this.props;

        const linkFn = () => {
            if(runningStep){
                R.map(stepId => openSubstepFn(stepId))(runningStep);
            } else if(failureStep){
                R.map(stepId => openSubstepFn(stepId))(failureStep);
            }
        };

        const toolClasses = ComponentUtils.classes("interestingStepTool", runningStep ? "runningStepTool" : "failureStepTool");
        const linkText = runningStep ? "Running Step" : "Failure Step";

        return <ToolboxLink key="interestingStepTool" toolClass={toolClasses} iconClass={SHOW_INTERESTING_STEP_ICON_CLASS}
                            linkText={linkText} linkFn={linkFn}/>;
    }

    toolTrigger(){
        /* eslint-disable */
        const {stepTrigger, showTriggerDialogFn, step} = this.props;

        const linkFn = () => showTriggerDialogFn(stepTrigger.url, stepTrigger.parameter || []);
        return <ToolboxLink key="triggerStepTool" iconClass={TRIGGER_STEP_ICON} toolClass="triggerStepTool" linkText="Trigger" linkFn={linkFn}/>;
    }

    getToolsForRendering() {
        const {stepTrigger, failureStep, runningStep, hasSubsteps} = this.props;

        const toolsForRendering = [];
        if(DevToggle.handleTriggerSteps){
            if(stepTrigger && stepTrigger.url){
                toolsForRendering.push(this.toolTrigger());
                return toolsForRendering;
            }
        }
        toolsForRendering.push(this.toolOutput());
        if((failureStep || runningStep) && hasSubsteps){
            toolsForRendering.push(this.toolInterestingStep());
        }
        if(hasSubsteps){
            toolsForRendering.push(this.toolSubstep());
        }

        toolsForRendering.push(this.toolKillStep());

        const notNil = R.pipe(R.isNil, R.not);
        return R.filter(notNil)(toolsForRendering);
    }

    showToolbar(toolsForRendering) {
        const classes = ComponentUtils.classes("toolbar", toolsForRendering.length <= 3 ? "withoutExpand" : "");

        return <div className={classes}>
            {R.view(R.lensIndex(0))(toolsForRendering)}
            {R.view(R.lensIndex(1))(toolsForRendering)}
            {R.view(R.lensIndex(2))(toolsForRendering)}
        </div>;
    }

    showToolbox(toolsForRendering) {
        if (!this.props.toolboxOpen) {
            return null;
        }

        return <div className="toolbox">
            {R.view(R.lensIndex(3))(toolsForRendering)}
            {R.view(R.lensIndex(4))(toolsForRendering)}
            {R.view(R.lensIndex(5))(toolsForRendering)}
        </div>;
    }

    showToggleToolbox(toolsForRendering) {
        const {toggleStepToolboxFn, toolboxOpen} = this.props;

        if(toolsForRendering.length <= 3) {
            return null;
        }

        const toggleToolboxClasses = ComponentUtils.classes("expandTools", "showNoIcon");
        const toggleToolboxIconClasses = ComponentUtils.classes("fa", (toolboxOpen ? "fa-angle-up" : "fa-angle-down"));

        return <div className={toggleToolboxClasses} onClick={toggleStepToolboxFn}>
            <i className={toggleToolboxIconClasses} aria-hidden="true"/>
        </div>;
    }

    render() {
        const toolsForRendering = this.getToolsForRendering();

        return <div className="tools">
            {this.showToolbar(toolsForRendering)}
            {this.showToolbox(toolsForRendering)}
            {this.showToggleToolbox(toolsForRendering)}
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
    killStepFn: PropTypes.func
};


const enrichTriggerUrl = (triggerData, config) => {
    if(triggerData && config) {
        return R.merge (triggerData, {url: "http://" + config.baseUrl + triggerData.url});
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
        killStepFn: () => LamdbdaUI.backend().killStep(buildId, stepId)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);