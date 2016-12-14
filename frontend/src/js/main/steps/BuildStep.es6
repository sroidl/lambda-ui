import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/buildStep.sass";
import {toggleSubsteps} from "actions/BuildStepActions.es6";
import R from "ramda";
import {StateIcon} from "../StateIcon.es6";
import Tools from "./Tools.es6";
import Moment from "moment";
import "moment-duration-format";
import DevToggle from "../DevToggles.es6";
import {classes} from "../ComponentUtils.es6";

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

export class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps, toggleSubsteps, showSubsteps} = this.props;

        const buildStepId = "Build" + buildId + "Step" + step.stepId;
        const buildStepClasses = classes("BuildStep", hasSubsteps && showSubsteps ? "WithSubsteps" : "LowermostStep", step.state);

        let stepDuration;
        if(DevToggle.handleTriggerSteps){
            stepDuration = typeof step.trigger === "object" ? "" : <div className="stepDuration">{duration(getStepDuration(step))}</div>;
        } else {
            stepDuration = <div className="stepDuration">{duration(getStepDuration(step))}</div>;
        }

        const buildStep = <div id={hasSubsteps && showSubsteps ? "" : buildStepId} className={buildStepClasses}>
            <StateIcon state={step.state}/>
            <div className={classes("StepName", hasSubsteps ? "HasSubsteps" : "")} onClick={hasSubsteps ? toggleSubsteps : ""}>{step.name}</div>
            {stepDuration}
            {hasSubsteps && showSubsteps ? "" :<Tools buildId={buildId} step={step}/>}
        </div>;

        const buildStepRedux = step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />;

        if(showSubsteps && hasSubsteps){
            let parentClass, childrenClass, childrenSteps;

            if(isParallel){
                parentClass = classes("BuildStepParallel");
                childrenClass = classes("BuildStepInParallel", buildStepId + "Steps");
                childrenSteps = R.map(step => {
                    return <div className={classes("ParallelLine")}>
                        {buildStepRedux(step)}
                    </div>;
                })(step.steps);
            } else{
                parentClass = classes("BuildStepWithSubsteps", buildStepId);
                childrenClass = classes("BuildStepSubsteps");
                childrenSteps = R.map(step => buildStepRedux(step))(step.steps);
            }

            return <div id={buildStepId} className={parentClass}>
                {buildStep}
                <div className={childrenClass}>
                    {childrenSteps}
                </div>
            </div>;
        }
        return buildStep;
    }
}

BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    isParallel: PropTypes.bool.isRequired,
    buildId: PropTypes.any.isRequired,
    hasSubsteps: PropTypes.bool.isRequired,
    toggleSubsteps: PropTypes.func.isRequired,
    showSubsteps: PropTypes.bool.isRequired
};

export const mapStateToProps = (state, ownProps) => {

    const showSubsteps = state.showSubsteps[ownProps.buildId] && state.showSubsteps[ownProps.buildId][ownProps.step.stepId] || false;

    return {
        showSubsteps: showSubsteps,
        hasSubsteps: ownProps.step.steps && ownProps.step.steps.length > 0 || false,
        step: ownProps.step,
        isParallel: ownProps.step.type === "parallel",
        buildId: ownProps.buildId
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleSubsteps: () => dispatch(toggleSubsteps(ownProps.buildId, ownProps.step.stepId))
    };
};

const BuildStepRedux = connect(mapStateToProps, mapDispatchToProps)(BuildStep);

export default BuildStepRedux;