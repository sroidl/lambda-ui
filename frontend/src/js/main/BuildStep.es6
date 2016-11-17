/* eslint-disable */
import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Moment from "moment";
import Utils from "./ComponentUtils.es6";
import "moment-duration-format";
import {showBuildOutput} from "actions/OutputActions.es6";
import {viewBuildStep} from "./actions/BuildDetailActions.es6";
import {toggleStepToolbox} from "actions/BuildStepActions.es6";
import {findParentOfFailedSubstep} from "steps/FailureStepFinder.es6";
import R from "ramda";
import {StateIcon} from "StateIcon.es6";
import {isStepInParallel} from "steps/InParallelChecker.es6";
import Toggles from "./DevToggles.es6";


const SHOW_OUTPUT_ICON_CLASS = "fa-align-justify";
const SHOW_SUBSTEP_ICON_CLASS = "fa-level-down";
const SHOW_FAILURE_STEP_ICON_CLASS = "fa-arrow-circle-down";

export const duration = ({startTime, endTime}) => {
    const start = Moment(startTime);
    const end = Moment(endTime);

    const duration = Moment.duration(end.diff(start), "milliseconds");
    const durationString = duration.format("hh:mm:ss");
    return durationString.length < 5 ? "00:" + durationString : durationString;
};

export const getStepDuration = (step) => {
    if (step.endTime || !step.startTime) {
        return step;
    }
    const endTime = Moment();
    return ({startTime: step.startTime, endTime: endTime});
};

export const BuildStep = props => {
    const {step, buildId, goIntoStepFn, showOutputFn, goIntoFailureStepFn, failureStep, isParallel, toggleStepToolboxFn, toolboxOpen} = props;

    if (Toggles.showParallelStepsDirectly) {
        if (!isParallel && step.type === "parallel") {
            const steps = R.map(step => <BuildStepCon key={step.stepId} buildId={buildId} step={step}/>)(step.steps);
            return <div key={step.stepId} className="parallelColumn">{steps}</div>;
        }
    }

    const infos = <div>
        <StateIcon state={step.state}/>
        <div className="stepName">{step.name}</div>
        <div className="stepDuration">{duration(getStepDuration(step))}</div>
    </div>;

    const parallelLines = <div>
        <div className="verticalLine"></div>
        <div className="verticalLine"></div>
    </div>;

    const hasSubsteps = step.steps && step.steps.length !== 0;
    const parallelClass = isParallel ? "inParallel" : "";

    const Tools = () => {
        const ToolboxLink = ({iconClass, linkText, linkCallback}) => {
            return <div className="tool" onClick={linkCallback}><div className="toolIcon"><i className={Utils.classes("fa", iconClass)}/></div><div className="linkText">{linkText}</div></div>
        };

        const showOutputTool = <ToolboxLink iconClass={SHOW_OUTPUT_ICON_CLASS} linkText="Show Output" linkCallback={showOutputFn}/>;
        const showSubstepTool = hasSubsteps ?  <ToolboxLink iconClass={SHOW_SUBSTEP_ICON_CLASS} linkText="Substeps" linkCallback={goIntoStepFn}/> : "";
        const showFailureStepTool = failureStep && hasSubsteps ? <ToolboxLink iconClass={SHOW_FAILURE_STEP_ICON_CLASS} linkText="Failure Step" linkCallback={() => goIntoFailureStepFn(failureStep)}/> : "";

        const toolbox = <div className="toolbox">
            {showOutputTool}
            {showSubstepTool}
            {showFailureStepTool}
        </div>;
        const toggleToolboxClasses = Utils.classes("fa", (toolboxOpen ? "fa-angle-up" : "fa-angle-down") );
        const toggleToolbox = <div className="expandTools" onClick={toggleStepToolboxFn}><i className={toggleToolboxClasses} aria-hidden="true"/></div>;

        return <div className="tools">
            <div className="toolbar">
                {showOutputTool}
                {showSubstepTool}
                {showFailureStepTool}
            </div>
            {toolboxOpen ? toolbox : ""}
            {toggleToolbox}
        </div>;
    };

    return <div className={Utils.classes("buildStep", step.state, parallelClass)}>
        {infos}
        <Tools/>
    </div>;
};


BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    buildId: PropTypes.number,
    failureStep: PropTypes.string,
    isParallel: PropTypes.bool,
    goIntoStepFn: PropTypes.func.isRequired,
    goIntoFailureStepFn: PropTypes.func.isRequired,
    showOutputFn: PropTypes.func.isRequired,
    toggleStepToolboxFn: PropTypes.func.isRequired,
    toolboxOpen: PropTypes.bool.isRequired
};

export const mapStateToProps = (state, ownProps) => {
    const newProps = R.merge(ownProps,
        {
            failureStep: findParentOfFailedSubstep(state, ownProps.buildId, ownProps.step.stepId),
            isParallel: isStepInParallel(state, ownProps.buildId, ownProps.step.stepId),
            toolboxOpen: R.pathOr(false, [ownProps.buildId, ownProps.step.stepId])(state.showStepToolbox),
            buildId: ownProps.buildId
        });
    return newProps;
};

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        goIntoStepFn: () => dispatch(viewBuildStep(ownProps.buildId, ownProps.step.stepId)),
        showOutputFn: () => dispatch(showBuildOutput(ownProps.buildId, ownProps.step.stepId)),
        goIntoFailureStepFn: (failureStep) => dispatch(viewBuildStep(ownProps.buildId, failureStep)),
        toggleStepToolboxFn: () => dispatch(toggleStepToolbox(ownProps.buildId, ownProps.step.stepId))
    };
};
const BuildStepCon = connect(mapStateToProps, mapDispatchToProps)(BuildStep);
export default BuildStepCon;
