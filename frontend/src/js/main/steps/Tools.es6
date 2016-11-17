import React, {PropTypes} from "react";
import Utils from "ComponentUtils.es6";
import {connect} from "react-redux";
import {showBuildOutput} from "actions/OutputActions.es6";
import {viewBuildStep} from "actions/BuildDetailActions.es6";
import {toggleStepToolbox} from "actions/BuildStepActions.es6";
import R from "ramda";

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

export class Tools extends React.Component{

    constructor(props) {
        super(props);
    }

    showOutputTool() {
        return <ToolboxLink toolClass="outputTool" iconClass={SHOW_OUTPUT_ICON_CLASS} linkText="Show Output" linkFn={this.props.showOutputFn}/>;
    }

    showSubstepTool() {
        if(this.props.hasSubsteps){
            return <ToolboxLink toolClass="substepTool" iconClass={SHOW_SUBSTEP_ICON_CLASS} linkText="Substeps" linkFn={this.props.goIntoStepFn}/>;
        }
        return "";
    }

    showFailureStepTool(){
        if(this.props.failureStep && this.props.hasSubsteps){
            return <ToolboxLink toolClass="failureStepTool" iconClass={SHOW_FAILURE_STEP_ICON_CLASS}
                                linkText="Failure Step" linkFn={this.props.goIntoFailureStepFn}/>;
        }
        return "";
    }

    showToolbar(){
        return <div className="toolbar">
            {this.showOutputTool()}
            {this.showSubstepTool()}
            {this.showFailureStepTool()}
        </div>;
    }

    showToolbox(){
        if(this.props.toolboxOpen){
            return <div className="toolbox">
                {this.showOutputTool()}
                {this.showSubstepTool()}
                {this.showFailureStepTool()}
            </div>;
        }
        return "";
    }

    showToggleToolbox(){
        const toggleToolboxClasses = Utils.classes("fa", (this.props.toolboxOpen ? "fa-angle-up" : "fa-angle-down"));
        return <div className="expandTools" onClick={this.props.toggleStepToolboxFn}>
            <i className={toggleToolboxClasses} aria-hidden="true"/>
        </div>;
    }

    render(){
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
    toolboxOpen: PropTypes.bool.isRequired,
    goIntoFailureStepFn: PropTypes.func.isRequired,
    goIntoStepFn: PropTypes.func.isRequired,
    showOutputFn: PropTypes.func.isRequired,
    toggleStepToolboxFn: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    const hasSubsteps = ownProps.step.steps && ownProps.step.steps.length !== 0 || false;

    return {failureStep: ownProps.failureStep,
            hasSubsteps: hasSubsteps,
            toolboxOpen: R.pathOr(false, [ownProps.buildId, ownProps.step.stepId])(state.showStepToolbox)};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        goIntoStepFn: () => dispatch(viewBuildStep(ownProps.buildId, ownProps.step.stepId)),
        showOutputFn: () => dispatch(showBuildOutput(ownProps.buildId, ownProps.step.stepId)),
        goIntoFailureStepFn: () => dispatch(viewBuildStep(ownProps.buildId, ownProps.failureStep)),
        toggleStepToolboxFn: () => dispatch(toggleStepToolbox(ownProps.buildId, ownProps.step.stepId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);