import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/newBuildStep.sass";
import {toggleSubsteps} from "actions/BuildStepActions.es6";
import R from "ramda";
import {StateIcon} from "../StateIcon.es6";

export const classes = (...classes) => {
    return R.reduce((acc, val) => acc + " n" + val, "")(classes).trim();
};

class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps, toggleSubsteps, showSubsteps} = this.props;

        const buildStepId = "Build" + buildId + "Step" + step.stepId;
        const buildStepClasses = classes("BuildStep", hasSubsteps && showSubsteps ? "WithSubsteps" : "LowermostStep", step.state);

        const buildStep = <div id={buildStepId} className={buildStepClasses} onClick={hasSubsteps ? toggleSubsteps : ""}>
            <StateIcon state={step.state}/>
            <div className={classes("StepName")}>{step.name}</div>
        </div>;

        const buildStepRedux = step => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} />;

        if(showSubsteps && (hasSubsteps || isParallel)){
            let parentClass, childrenClass, hideLine;
            const childrenSteps = R.map(step => buildStepRedux(step))(step.steps);

            if(isParallel){
                parentClass = classes("BuildStepParallel");
                childrenClass = classes("BuildStepInParallel");
                hideLine = <div className={classes("HideLineContainer")}><div className={classes("HideLineLeft")}></div><div className={classes("HideLineRight")}></div></div>;
            } else{
                parentClass = classes("BuildStepWithSubsteps");
                childrenClass = classes("BuildStepSubsteps");
                hideLine = "";
            }

            return <div className={parentClass}>
                {buildStep}
                <div className={childrenClass}>
                    {childrenSteps}
                    {hideLine}
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

    //const showSubsteps = state.showSubsteps[ownProps.buildId] && state.showSubsteps[ownProps.buildId][ownProps.step.stepId];
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



