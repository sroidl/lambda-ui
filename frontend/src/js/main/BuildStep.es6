import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Moment from "moment";
import Utils from "./ComponentUtils.es6";
import "moment-duration-format";
import {showBuildOutput} from "./Actions.es6";
import {viewBuildStep} from "./actions/BuildDetailActions.es6";

const duration = ({startTime, endTime}) => {
    const start = Moment(startTime);
    const end = Moment(endTime);

    const duration = Moment.duration(end.diff(start), "milliseconds");

    return duration.format("hh:mm:ss");
};


const buildIcon = (stepState) => {
    let iconClass;
    if (stepState === "success") {
        iconClass = "fa-check";
    }
    else if (stepState === "failure") {
        iconClass = "fa-times";
    }
    else if (stepState === "running") {
        iconClass = "fa-cog";
    }
    else {
        iconClass = "fa-ellipsis-h";
    }
    return <div className="buildIcon"><i className={"fa " + iconClass}/></div>;
};

export const BuildStep = props => {
    const {step, goIntoStepFn, showOutputFn} = props;

    const buildStepIcon = buildIcon(step.state);

    const infos = <div>
        {buildStepIcon}
        <div className="stepName">{step.name}</div>
        <div className="stepDuration">{duration(step)}</div>
    </div>;
    const goIntoStepLink = <a className="goIntoStepLink" href="#" onClick={goIntoStepFn}>Substeps</a>;
    const showOutputLink = <a className="showOutputLink" href="#" onClick={showOutputFn}>Show Output</a>;
    const hasSubsteps = step.steps && step.steps.length !== 0;

    return <div className={Utils.classes("buildStep", step.state)}>
        {infos}
        {showOutputLink}
        <br/>&nbsp;
        {hasSubsteps ? goIntoStepLink : ""}
    </div>;
};

BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    goIntoStepFn: PropTypes.func.isRequired,
    showOutputFn: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        goIntoStepFn: () => dispatch(viewBuildStep(ownProps.buildId, ownProps.step.stepId)),
        showOutputFn: () => dispatch(showBuildOutput(ownProps.buildId, ownProps.step.stepId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildStep);
