import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Moment from "moment";
import R from "ramda";
import Utils from "./ComponentUtils.es6";
import "moment-duration-format";
import {findParentOfFailedSubstep, findParentOfRunningSubstep} from "steps/InterestingStepFinder.es6";
import {isStepInParallel} from "steps/InParallelChecker.es6";
import {StateIcon} from "StateIcon.es6";
import Tools from "steps/Tools.es6";
import {toggleParallelStep} from "actions/BuildStepActions.es6";
import DevToggle from "DevToggles.es6";

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

export const StepInfos = ({step, isTriggerInfo}) => {
    let stepDuration;
    if(DevToggle.handleTriggerSteps){
        stepDuration = isTriggerInfo ? "" : <div className="stepDuration">{duration(getStepDuration(step))}</div>;
    } else {
        stepDuration = <div className="stepDuration">{duration(getStepDuration(step))}</div>;
    }

    return <div>
        <StateIcon state={step.state}/>
        <div className="stepName">{step.name}</div>
        {stepDuration}
    </div>;
};

StepInfos.propTypes = {
    step: PropTypes.object.isRequired,
    isTriggerInfo: PropTypes.bool.isRequired
};

const HideLine = ({isParallel}) => {
    if(isParallel){
        return <div><div className="hideLine"></div><div className="hideLine"></div></div>;
    }
    return <div></div>;
};

HideLine.propTypes = {
    isParallel: PropTypes.bool.isRequired
};

export class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    showParallelSteps() {
        const {buildId, step, toggleParallelStep} = this.props;

        const steps = R.map(step => <BuildStepCon key={step.stepId} buildId={buildId} step={step}/>)(step.steps);

        return <div key={step.stepId} className="parallelColumn">
            <div className="closeParallelStep" onClick={toggleParallelStep}>
                <i className="fa fa-close" aria-hidden="true"></i>
            </div>
            <div className="parallelLeft"></div>
            <div className="parallelRight"></div>
            <div>{steps}</div>
        </div>;
    }

    render() {
        const {step, buildId, isParallel, showDirectlyInParallel, failureStep, runningStep} = this.props;

        if (!isParallel && showDirectlyInParallel) {
            return this.showParallelSteps();
        }

        const buildStepClasses = Utils.classes("buildStep", step.state, isParallel ? "inParallel" : "");
        const isTriggerStep = typeof step.trigger === "object";

        return <div className={buildStepClasses}>
            <HideLine isParallel={isParallel}/>
            <StepInfos step={step} isTriggerInfo={isTriggerStep}/>
            <Tools buildId={buildId} step={step} failureStep={failureStep} runningStep={runningStep}/>
        </div>;
    }
}

BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    buildId: PropTypes.number.isRequired,
    isParallel: PropTypes.bool.isRequired,
    showDirectlyInParallel: PropTypes.bool.isRequired,
    failureStep: PropTypes.string,
    runningStep: PropTypes.string,
    toggleParallelStep: PropTypes.func.isRequired
};

export const mapStateToProps = (state, ownProps) => {

    return R.merge(ownProps, {
        isParallel: isStepInParallel(state, ownProps.buildId, ownProps.step.stepId),
        showDirectlyInParallel: R.pathOr(false, [ownProps.buildId, ownProps.step.stepId])(state.showInParallel),
        buildId: ownProps.buildId,
        failureStep: findParentOfFailedSubstep(state, ownProps.buildId, ownProps.step.stepId),
        runningStep: findParentOfRunningSubstep(state, ownProps.buildId, ownProps.step.stepId)
    });
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleParallelStep: () => dispatch(toggleParallelStep(ownProps.buildId, ownProps.step.stepId))
    };
};

const BuildStepCon = connect(mapStateToProps, mapDispatchToProps)(BuildStep);
export default BuildStepCon;