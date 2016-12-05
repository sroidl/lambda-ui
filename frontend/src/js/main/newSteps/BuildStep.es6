/* eslint-disable */
import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/newBuildStep.sass";
import isStepInParallel from "steps/InParallelChecker.es6";
import R from "ramda";

class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps} = this.props;

        if(isParallel && step.steps && step.steps.length > 0){
            return <div className="nBuildStepParallel">
                {R.map(step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />)(step.steps)}
            </div>;
        }

        if(hasSubsteps){
            return <div className="nBuildStepWithSubsteps">
                <div className="nBuildStep">StepId: {step.stepId}</div>
                <div className="nBuildStepSubsteps">{R.map(step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />)(step.steps)}</div>
            </div>
        }

        return <div className="nBuildStep">StepId: {step.stepId}</div>;
    }
}

BuildStep.propTypes = {
    step: PropTypes.object.isRequired,
    isParallel: PropTypes.bool.isRequired,
    buildId: PropTypes.any.isRequired,
    hasSubsteps: PropTypes.bool.isRequired
};

export const mapStateToProps = (state, ownProps) => {

    return {
        hasSubsteps: ownProps.step.steps && ownProps.step.steps.length > 0 || false,
        step: ownProps.step,
        isParallel: ownProps.step.type === "parallel",
        buildId: ownProps.buildId
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

const BuildStepRedux = connect(mapStateToProps, mapDispatchToProps)(BuildStep);

export default BuildStepRedux;