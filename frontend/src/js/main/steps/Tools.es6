import React, {PropTypes} from "react";
import Utils from "ComponentUtils.es6";
import {connect} from "react-redux";
import {showBuildOutput} from "actions/OutputActions.es6";
import {viewBuildStep} from "actions/BuildDetailActions.es6";
import {toggleStepToolbox, toggleParallelStep} from "actions/BuildStepActions.es6";
import R from "ramda";
import Toggles from "DevToggles.es6";

export const SHOW_OUTPUT_ICON_CLASS = "fa-align-justify";
export const SHOW_SUBSTEP_ICON_CLASS = "fa-level-down";
export const SHOW_FAILURE_STEP_ICON_CLASS = "fa-arrow-circle-down";

export const ToolboxLink = ({iconClass, toolClass, linkText, linkFn}) => {
    return <div className={Utils.classes(toolClass, "tool")} onClick={linkFn}>
        <div className="toolIcon"><i className={Utils.classes("fa", iconClass)}/></div>
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
        if (this.props.hasSubsteps) {
            let linkFn = this.props.goIntoStepFn;
            if (Toggles.showParallelStepsDirectly) {
                if (this.props.isParallel) {
                    linkFn = this.props.toggleParallelStepFn;
                }
            }
            return <ToolboxLink toolClass="substepTool" iconClass={SHOW_SUBSTEP_ICON_CLASS} linkText="Substeps"
                                linkFn={linkFn}/>;
        }
        return "";
    }

    showFailureStepTool() {
        const {failureStep, hasSubsteps, goIntoFailureStepFn} = this.props;
        if (failureStep && hasSubsteps) {
            return <ToolboxLink toolClass="failureStepTool" iconClass={SHOW_FAILURE_STEP_ICON_CLASS}
                                linkText="Failure Step" linkFn={() => goIntoFailureStepFn(failureStep)}/>;
        }
        return "";
    }

    showToolbar() {
        return <div className="toolbar">
            {this.showOutputTool()}
            {this.showSubstepTool()}
            {this.showFailureStepTool()}
        </div>;
    }

    showToolbox() {
        if (this.props.toolboxOpen) {
            return <div className="toolbox">
                {this.showOutputTool()}
                {this.showSubstepTool()}
                {this.showFailureStepTool()}
            </div>;
        }
        return "";
    }

    showToggleToolbox() {
        const toggleToolboxClasses = Utils.classes("fa", (this.props.toolboxOpen ? "fa-angle-up" : "fa-angle-down"));
        return <div className="expandTools" onClick={this.props.toggleStepToolboxFn}>
            <i className={toggleToolboxClasses} aria-hidden="true"/>
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
    failureStep: PropTypes.string,
    hasSubsteps: PropTypes.bool.isRequired,
    isParallel: PropTypes.bool.isRequired,
    toolboxOpen: PropTypes.bool.isRequired,
    goIntoFailureStepFn: PropTypes.func.isRequired,
    goIntoStepFn: PropTypes.func.isRequired,
    showOutputFn: PropTypes.func.isRequired,
    toggleStepToolboxFn: PropTypes.func.isRequired,
    toggleParallelStepFn: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    const hasSubsteps = ownProps.step.steps && ownProps.step.steps.length !== 0 || false;
    const isParallel = ownProps.step.type && ownProps.step.type === "parallel" || false;

    return {
        failureStep: ownProps.failureStep,
        hasSubsteps: hasSubsteps,
        isParallel: isParallel,
        toolboxOpen: R.pathOr(false, [ownProps.buildId, ownProps.step.stepId])(state.showStepToolbox)
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const buildId = ownProps.buildId;
    const stepId = ownProps.step.stepId;

    return {
        goIntoStepFn: () => dispatch(viewBuildStep(buildId, stepId)),
        showOutputFn: () => dispatch(showBuildOutput(buildId, stepId)),
        goIntoFailureStepFn: (stepId) => dispatch(viewBuildStep(buildId, stepId)),
        toggleStepToolboxFn: () => dispatch(toggleStepToolbox(buildId, stepId)),
        toggleParallelStepFn: () => dispatch(toggleParallelStep(buildId, stepId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);