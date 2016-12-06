import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/newBuildStep.sass";
import {toggleSubsteps} from "actions/BuildStepActions.es6";
import R from "ramda";

export const classes = (...classes) => {
    return R.reduce((acc, val) => acc + " n" + val, "")(classes).trim();
};

class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps, toggleSubsteps, showSubsteps} = this.props;

        const buildStep = <div id={"Build" + buildId + "Step" + step.stepId} className={classes("BuildStep", hasSubsteps ? "" : "LowermostStep")} onClick={toggleSubsteps}>{step.name}</div>;
        const mapBuildSteps = R.map(step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />);

        if(showSubsteps && (hasSubsteps || isParallel)){
            let parentClass = classes("BuildStepWithSubsteps");
            let childrenClass = classes("BuildStepSubsteps");
            if(isParallel){
                parentClass = classes("BuildStepParallel");
                childrenClass = classes("BuildStepInParallel");
            }

            return <div className={parentClass}>
                {buildStep}
                <div className={childrenClass}>
                    {mapBuildSteps(step.steps)}
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




