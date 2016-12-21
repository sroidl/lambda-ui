import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/buildStep.sass";
import {toggleSubstep} from "actions/BuildStepActions.es6";
import R from "ramda";
import {StateIcon} from "../StateIcon.es6";
import Tools from "./Tools.es6";
import Moment from "moment";
import "moment-duration-format";
import DevToggle from "../DevToggles.es6";
import {classes} from "../ComponentUtils.es6";

export const BUILDSTEP_HIGHLIGHT_DURATION_IN_MS = 500;

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

    getBuildStepId(){
        const {buildId, step} = this.props;
        return "Build" + buildId + "Step" + step.stepId;
    }

    renderStepDuration() {
        const {step} = this.props;

        if(DevToggle.handleTriggerSteps){
            return typeof step.trigger === "object" ? "" : <div className="stepDuration">{duration(getStepDuration(step))}</div>;
        }
        return <div className="stepDuration">{duration(getStepDuration(step))}</div>;

    }

    renderBuildStep() {
        const {step, buildId, hasSubsteps, toggleSubsteps, showSubsteps} = this.props;

        const buildStepClasses = classes("BuildStep", hasSubsteps && showSubsteps ? "WithSubsteps" : "LowermostStep", step.state);

        return <div id={hasSubsteps && showSubsteps ? "" : this.getBuildStepId()} className={buildStepClasses}>
            <StateIcon state={step.state}/>
            <div className={classes("StepName", hasSubsteps ? "HasSubsteps" : "")} onClick={hasSubsteps ? toggleSubsteps : ""}>{step.name}</div>
            {this.renderStepDuration()}
            {hasSubsteps && showSubsteps ? "" :<Tools buildId={buildId} step={step}/>}
        </div>;
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps, showSubsteps} = this.props;

        if(!showSubsteps || !hasSubsteps){
            return this.renderBuildStep();
        }

        const buildStepRedux = step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />;
        let parentClass, childrenClass, childrenSteps;

        if(isParallel){
            parentClass = classes("BuildStepParallel");
            childrenClass = classes("BuildStepInParallel", this.getBuildStepId() + "Steps");
            childrenSteps = R.map(step => {
                return <div className={classes("ParallelLine")}>
                    {buildStepRedux(step)}
                </div>;
            })(step.steps);
        } else{
            parentClass = classes("BuildStepWithSubsteps", this.getBuildStepId());
            childrenClass = classes("BuildStepSubsteps");
            childrenSteps = R.map(step => buildStepRedux(step))(step.steps);
        }

        return <div id={this.getBuildStepId()} className={parentClass}>
            {this.renderBuildStep()}
            <div className={childrenClass}>
                {childrenSteps}
            </div>
        </div>;
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

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleSubsteps: () => dispatch(toggleSubstep(ownProps.buildId, ownProps.step.stepId))
    };
};

const BuildStepRedux = connect(mapStateToProps, mapDispatchToProps)(BuildStep);

export default BuildStepRedux;