/* eslint-disable */
import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/newBuildStep.sass";
import {toggleSubsteps} from "actions/BuildStepActions.es6";
import R from "ramda";

class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps, toggleSubsteps, showSubsteps} = this.props;

        if(showSubsteps && isParallel){
            return <div className="nBuildStepParallel">
                    <div className="nBuildStep" onClick={toggleSubsteps}>{step.name}</div>
                    <div className="nBuildStepInParallel">
                        {R.map(step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />)(step.steps)}
                    </div>
                </div>;
        }




        if(showSubsteps && hasSubsteps){
            return <div className="nBuildStepWithSubsteps">
                <div className="nBuildStep" onClick={toggleSubsteps}>{step.name}</div>
                <div className="nBuildStepSubsteps">{R.map(step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />)(step.steps)}</div>
            </div>
        }

        return <div className="nBuildStep" onClick={toggleSubsteps}>{step.name}</div>;
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




    // const showSubsteps = state.showSubsteps[ownProps.buildId] && state.showSubsteps[ownProps.buildId][ownProps.step.stepId];
    const showSubsteps = true;

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
