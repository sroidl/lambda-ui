/* eslint-disable */
import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Moment from "moment";
import Utils from "./ComponentUtils.es6";
import "moment-duration-format";
import R from "ramda";
import {StateIcon} from "StateIcon.es6";
import Tools from "steps/Tools.es6"
import {findParentOfFailedSubstep} from "steps/FailureStepFinder.es6";
import {isStepInParallel} from "steps/InParallelChecker.es6";
import Toggles from "./DevToggles.es6";

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

export const StepInfos = ({step}) => {
    return <div>
        <StateIcon state={step.state}/>
        <div className="stepName">{step.name}</div>
        <div className="stepDuration">{duration(getStepDuration(step))}</div>
    </div>;
};
const HideLine = ({isParallel}) => isParallel ? <div className="hideLine"></div> : <div></div>;

export class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {step, buildId, isParallel, failureStep} = this.props;

        if (Toggles.showParallelStepsDirectly) {
            if (!isParallel && step.type === "parallel") {
                const steps = R.map(step => <BuildStepCon key={step.stepId} buildId={buildId} step={step}/>)(step.steps);
                return <div key={step.stepId} className="parallelColumn">
                    <div className="parallelLeft"></div>
                    <div className="parallelRight"></div>
                    <div>{steps}</div>
                </div>;
            }
        }

        const buildStepClasses = Utils.classes("buildStep", step.state, isParallel ? "inParallel" : "");

        return <div className={buildStepClasses}>
            <HideLine isParallel={isParallel} />
            <HideLine isParallel={isParallel} />
            <StepInfos step={step} />
            <Tools buildId={buildId} step={step} failureStep={failureStep} />
        </div>;
    }
}

BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    buildId: PropTypes.number,
    isParallel: PropTypes.bool,
    failureStep: PropTypes.string
};

export const mapStateToProps = (state, ownProps) => {
    return R.merge(ownProps, {
            isParallel: isStepInParallel(state, ownProps.buildId, ownProps.step.stepId),
            buildId: ownProps.buildId,
            failureStep: findParentOfFailedSubstep(state, ownProps.buildId, ownProps.step.stepId)
        });
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

const BuildStepCon = connect(mapStateToProps, mapDispatchToProps)(BuildStep);
export default BuildStepCon;