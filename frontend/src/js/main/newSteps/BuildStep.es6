import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../../sass/newBuildStep.sass";
import {toggleSubsteps} from "actions/BuildStepActions.es6";
import R from "ramda";
import {StateIcon} from "../StateIcon.es6";

export const classes = (...classes) => {
    return R.reduce((acc, val) => acc + " n" + val, "")(classes).trim();
};

const createDiv = divClass => <div className={divClass}></div>;

class BuildStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {step, isParallel, buildId, hasSubsteps, toggleSubsteps, showSubsteps, divLines} = this.props;

        const buildStepId = "Build" + buildId + "Step" + step.stepId;
        const buildStepClasses = classes("BuildStep", hasSubsteps ? "WithSubsteps" : "LowermostStep", step.state);

        const buildStepLines = () => {
            if(divLines && divLines.length > 0){
                return R.map(line => createDiv(classes(line)))(divLines);
            }
            return createDiv(classes("ConnectionLine"));
        };

        const buildStep = <div id={buildStepId} className={buildStepClasses} onClick={toggleSubsteps}>
            <div className={classes("ConnectionLine", divLines || "")}></div>
            <StateIcon state={step.state}/>
            {buildStepLines()}
            <div className={classes("StepName")}>{step.name}</div>
        </div>;

        const buildStepRedux = (step, divLines) => <BuildStepRedux key={step.stepId} step={step} buildId={buildId} divLines={divLines} />;

        if(showSubsteps && (hasSubsteps || isParallel)){
            let parentClass, childrenClass, childrenSteps;
            childrenSteps = () => {};

            if(isParallel){
                parentClass = classes("BuildStepParallel");
                childrenClass = classes("BuildStepInParallel");
                childrenSteps = R.map(step => buildStepRedux(step, ["ConnectionLine ConnectionLineShort"]))(step.steps);
            } else{
                parentClass = classes("BuildStepWithSubsteps");
                childrenClass = classes("BuildStepSubsteps");

                let count = 1;
                childrenSteps = R.map(step => {
                    if(count === 1){
                        count++;
                        return buildStepRedux(step, ["ConnectionLine ConnectionLineShort"]);
                    }
                    count++;
                    return buildStepRedux(step, []);
                })(step.steps);
            }

            return <div className={parentClass}>
                {createDiv(classes("ConnectionLine", divLines || ""))}
                <div className={classes("ConnectionLineVerticalDown")}></div>
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
    showSubsteps: PropTypes.bool.isRequired,
    divLines: PropTypes.array
};

export const mapStateToProps = (state, ownProps) => {

    // const showSubsteps = state.showSubsteps[ownProps.buildId] && state.showSubsteps[ownProps.buildId][ownProps.step.stepId];
    const showSubsteps = true;

    return {
        showSubsteps: showSubsteps,
        hasSubsteps: ownProps.step.steps && ownProps.step.steps.length > 0 || false,
        step: ownProps.step,
        isParallel: ownProps.step.type === "parallel",
        buildId: ownProps.buildId,
        divLines: ownProps.divLines,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleSubsteps: () => dispatch(toggleSubsteps(ownProps.buildId, ownProps.step.stepId))
    };
};

const BuildStepRedux = connect(mapStateToProps, mapDispatchToProps)(BuildStep);

export default BuildStepRedux;












