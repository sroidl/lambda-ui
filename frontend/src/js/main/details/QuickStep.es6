import React, {PropTypes} from "react";
import {connect} from "react-redux";
import R from "ramda";
import {scrollToStep} from "../actions/BuildDetailActions.es6";
import {classes} from "../ComponentUtils.es6";

export class QuickStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {showSubsteps, step, buildId, scrollToStep, maxDepth, curDepth} = this.props;

        const quickStepClasses = classes("quickStep", step.state);

        if(!showSubsteps || !step.steps || step.steps.length === 0 || maxDepth === curDepth){
            return <div title={step.name} className={quickStepClasses} onClick={scrollToStep}></div>;
        }

        return <div className="quickStepContainer">
            <div className={quickStepClasses} onClick={scrollToStep}></div>
            <div className="quickSubsteps">
                {R.map(step => <QuickStepRedux maxDepth={maxDepth} curDepth={curDepth + 1} key={step.stepId} buildId={buildId} step={step} />)(step.steps)}</div>
        </div>;
    }
}

QuickStep.propTypes = {
    buildId: PropTypes.number.isRequired,
    step: PropTypes.object.isRequired,
    showSubsteps: PropTypes.bool.isRequired,
    scrollToStep: PropTypes.func.isRequired,
    maxDepth: PropTypes.number.isRequired,
    curDepth: PropTypes.number.isRequired
};

export const mapStateToProps = (state, ownProps) => {

    const showSubsteps = state.showSubsteps[ownProps.buildId] && state.showSubsteps[ownProps.buildId][ownProps.step.stepId] || false;

    return {
        buildId: ownProps.buildId,
        step: ownProps.step,
        showSubsteps: showSubsteps,
        maxDepth: ownProps.maxDepth,
        curDepth: ownProps.curDepth
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        scrollToStep: () => dispatch(scrollToStep(ownProps.buildId, ownProps.step.stepId))
    };
};

const QuickStepRedux = connect(mapStateToProps, mapDispatchToProps)(QuickStep);

export default  QuickStepRedux;

