import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {requestDetailsPolling} from "./actions/BackendActions.es6";
import R from "ramda";
import {getInterestingStepId, shouldShowInterestingStep} from "steps/InterestingStepFinder.es6";
import BuildStep from "newSteps/BuildStep.es6";
import {makeDraggable} from "newSteps/HorizontalScroll.es6";

export class BuildDetails extends React.Component {

    componentDidUpdate(){
        if(this.props.stepsToDisplay){
            makeDraggable(this.props.buildId);
        }
    }

    render(){
        const {open, stepsToDisplay, requestDetailsFn, buildId} = this.props;

        if (!open) {
            return null;
        }

        if (!stepsToDisplay) {
            requestDetailsFn();
            return <div className="twelve columns buildDetails">
                <div className="row loadingMessage">Loading build details</div>
            </div>;
        }

        return <div id={"draggable" + buildId} className="nBuildDetails">
            {R.map(step => <BuildStep key={step.stepId} step={step} buildId={buildId} />)(stepsToDisplay)}
        </div>;
    }
}

BuildDetails.propTypes = {
    buildId: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    requestDetailsFn: PropTypes.func.isRequired,
    stepsToDisplay: PropTypes.array
};

const resolveStepsToDisplay = (buildDetails, stepIdToShow) => {
    if (!buildDetails.steps) {
        return null;
    }

    const flatSteps = step => {
        if (!step.steps || step.steps.length === 0) {
            return step;
        }
        const subs = R.map(flatSteps)(step.steps);
        return [step, subs];
    };

    const resolvedStepsFn = R.pipe(R.filter(step => step.stepId === stepIdToShow), R.map(step => step.steps), R.flatten);

    let resolvedSteps = R.pipe(R.chain(flatSteps), R.flatten, resolvedStepsFn)(buildDetails.steps);

    if (resolvedSteps.length === 0) {
        resolvedSteps = buildDetails.steps;
    }

    return resolvedSteps;
};

export const mapStateToProps = (state, ownProps) => {
    const buildId = Number.parseInt(ownProps.buildId);
    const details = state.buildDetails[buildId] || {};
    const currentStepId = shouldShowInterestingStep(state, ownProps.buildId) ? getInterestingStepId(state, buildId) : state.viewBuildSteps[buildId];
    const stepsToDisplay = resolveStepsToDisplay(details, currentStepId);

    return {
        buildId: buildId,
        details: state.buildDetails[buildId],
        stepsToDisplay: stepsToDisplay,
        open: state.openedBuilds[buildId] || false,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        requestDetailsFn: () => dispatch(requestDetailsPolling(ownProps.buildId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);
