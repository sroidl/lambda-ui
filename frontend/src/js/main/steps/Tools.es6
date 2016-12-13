import React, {PropTypes} from "react";
import Utils from "ComponentUtils.es6";
import {connect} from "react-redux";
import {showBuildOutput} from "actions/OutputActions.es6";
import {toggleStepToolbox, openSubsteps} from "actions/BuildStepActions.es6";
import {openTriggerDialog} from "actions/BuildStepTriggerActions.es6";
import R from "ramda";
import DevToggle from "../DevToggles.es6";
import {findParentOfFailedSubstep, findParentOfRunningSubstep} from "./InterestingStepFinder.es6";

export const SHOW_OUTPUT_ICON_CLASS = "fa-align-justify";
export const SHOW_SUBSTEP_ICON_CLASS = "fa-level-down";
export const SHOW_INTERESTING_STEP_ICON_CLASS = "fa-arrow-circle-down";
export const TRIGGER_STEP_ICON = "fa-play";

export const ToolboxLink = ({iconClass, toolClass, linkText, linkFn}) => {
    return <div className={Utils.classes(toolClass, "tool")} onClick={linkFn}>
        <div className="toolIcon" title={linkText}><i className={Utils.classes("fa", iconClass)}/></div>
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

    showOutputTool() {
        return <ToolboxLink toolClass="outputTool" iconClass={SHOW_OUTPUT_ICON_CLASS} linkText="Show Output"
                            linkFn={this.props.showOutputFn}/>;
    }

    showSubstepTool() {
        const {step, hasSubsteps, openSubstepFn} = this.props;
        if (hasSubsteps) {
            const linkFn = () => openSubstepFn(step.stepId);
            return <ToolboxLink toolClass="substepTool" iconClass={SHOW_SUBSTEP_ICON_CLASS}
                                linkText="Substeps" linkFn={linkFn}/>;
        }
        return "";
    }

    showInterestingStepTool() {
        const {failureStep, runningStep, hasSubsteps, openSubstepFn} = this.props;

        if((!failureStep && !runningStep) || !hasSubsteps){
            return "";
        }

        const linkFn = () => {
            if(runningStep){
                R.map(stepId => openSubstepFn(stepId))(runningStep);
            } else if(failureStep){
                R.map(stepId => openSubstepFn(stepId))(failureStep);
            }
        };

        const toolClasses = Utils.classes("interestingStepTool", runningStep ? "runningStepTool" : "failureStepTool");
        const linkText = runningStep ? "Running Step" : "Failure Step";

        return <ToolboxLink toolClass={toolClasses} iconClass={SHOW_INTERESTING_STEP_ICON_CLASS}
                            linkText={linkText} linkFn={linkFn}/>;
    }

    showTriggerTool(){
        const {stepTrigger, showTriggerDialogFn} = this.props;
        if(stepTrigger && stepTrigger.url){
            const linkFn = () => showTriggerDialogFn(stepTrigger.url, stepTrigger.parameter || []);
            return <ToolboxLink iconClass={TRIGGER_STEP_ICON} toolClass="triggerStepTool" linkText="Trigger" linkFn={linkFn}/>;
        }
        return "";
    }

    showToolbar() {
        if(DevToggle.handleTriggerSteps){
            if(this.props.stepType === "trigger"){
                return <div className="toolbar">
                    {this.showTriggerTool()}
                </div>;
            }
        }

        return <div className="toolbar">
            {this.showOutputTool()}
            {this.showSubstepTool()}
            {this.showInterestingStepTool()}
        </div>;
    }

    showToolbox() {
        if (this.props.toolboxOpen) {
            return <div className="toolbox">

            </div>;
        }
        return "";
    }

    showToggleToolbox() {
        let triggerClass, toggleOnClick;

        if(DevToggle.handleTriggerSteps){
            triggerClass = this.props.stepTrigger ? "showNoIcon" : "";
            toggleOnClick = this.props.stepTrigger ? "" : this.props.toggleStepToolboxFn;
        } else {
            triggerClass = "";
            toggleOnClick = this.props.toggleStepToolboxFn;
        }

        const toggleToolboxClasses = Utils.classes("expandTools", triggerClass, "showNoIcon");
        const toggleToolboxIconClasses = Utils.classes("fa", (this.props.toolboxOpen ? "fa-angle-up" : "fa-angle-down"));

        return <div className={toggleToolboxClasses} onClick={toggleOnClick}>
            <i className={toggleToolboxIconClasses} aria-hidden="true"/>
        </div>;
    }

    render() {

        return <div className="tools">
            {this.showToolbar()}
            {this.showToolbox()}
            {this.showToggleToolbox()}
        </div>;
    }
}
Tools.propTypes = {
    step: PropTypes.object,
    failureStep: PropTypes.array,
    runningStep: PropTypes.array,
    hasSubsteps: PropTypes.bool.isRequired,
    stepType: PropTypes.string.isRequired,
    toolboxOpen: PropTypes.bool.isRequired,
    openSubstepFn: PropTypes.func.isRequired,
    showOutputFn: PropTypes.func.isRequired,
    toggleStepToolboxFn: PropTypes.func.isRequired,
    showTriggerDialogFn: PropTypes.func.isRequired,
    stepTrigger: PropTypes.object
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
        showTriggerDialogFn: (url, parameter) => dispatch(openTriggerDialog(url, parameter, stepName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);