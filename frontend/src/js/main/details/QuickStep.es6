import React, {PropTypes} from "react";
import {connect} from "react-redux";
import R from "ramda";
import {toggleSubsteps} from "../actions/BuildStepActions.es6";
import {classes} from "../ComponentUtils.es6";

export class QuickStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {showSubsteps, step, buildId, toggleQuickStep} = this.props;

        const quickStepClasses = classes("quickStep", step.state);
        const onClick = step.steps && step.steps.length > 0 ? toggleQuickStep : "";

        if(showSubsteps && step.steps && step.steps.length > 0){
            return <div className="quickStepContainer">
                <div className={quickStepClasses} onClick={onClick}></div>
                <div className="quickSubsteps">
                    {R.map(step => <QuickStepRedux key={step.stepId} buildId={buildId} step={step} />)(step.steps)}
                </div>
            </div>;
        }

        return <div className={quickStepClasses} onClick={onClick}></div>;
    }
}

QuickStep.propTypes = {
    buildId: PropTypes.number.isRequired,
    step: PropTypes.object.isRequired,
    showSubsteps: PropTypes.bool.isRequired,
    toggleQuickStep: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {

    const showSubsteps = state.showSubsteps[ownProps.buildId] && state.showSubsteps[ownProps.buildId][ownProps.step.stepId] || false;

    return {
        buildId: ownProps.buildId,
        step: ownProps.step,
        showSubsteps: showSubsteps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleQuickStep: () => dispatch(toggleSubsteps(ownProps.buildId, ownProps.step.stepId))
    };
};

const QuickStepRedux = connect(mapStateToProps, mapDispatchToProps)(QuickStep);

export default  QuickStepRedux;

