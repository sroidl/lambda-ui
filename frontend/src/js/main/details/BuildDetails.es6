import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {noScrollToStep} from "../actions/BuildDetailActions.es6";
import R from "ramda";
import BuildStep from "../steps/BuildStep.es6";
import {makeDraggable, scrollToStep} from "../steps/HorizontalScroll.es6";
import QuickDetails from "../details/QuickDetails.es6";
import {findPathToMostInterestingStep} from "../steps/InterestingStepFinder.es6";
import {openSubsteps} from "../actions/BuildStepActions.es6";
import "../../../sass/buildDetails.sass";
export class BuildDetails extends React.Component {

    constructor(props) {
        super(props);
        this.registeredEventHandler = false;
        this.initialized = false;
    }

    componentDidUpdate() {
        const {open, buildId, stepToScroll, noScrollToStepFn, stepsToDisplay, openSubstepsFn, buildDetails} = this.props;

        if (open && !this.registeredEventHandler) {
            if (makeDraggable(buildId)) {
                this.registeredEventHandler = true;
            }
        }
        if (!open) {
            this.registeredEventHandler = false;
        }

        if (stepToScroll) {
            scrollToStep(buildId, stepToScroll);
            noScrollToStepFn();
        }

        if (stepsToDisplay && !this.initialized) {

            const interestingPath = findPathToMostInterestingStep(buildDetails, "root");
            if (!R.isNil(interestingPath)) {
                const {path} = interestingPath;
                const curriedOpenSubstepsFn = R.curry(openSubstepsFn)(buildId);
                R.forEach(curriedOpenSubstepsFn)(path);
            }
            this.initialized = true;
        }

    }

    render() {
        const {open, stepsToDisplay, buildId} = this.props;
        if (!open) {
            return null;
        }

        if (!stepsToDisplay) {
            return <div className="twelve columns buildDetails">
                <div className="row loadingMessage">Loading build details</div>
            </div>;
        }

        const quickDetails = <QuickDetails buildId={buildId}/>;

        return <div className="BuildDetails" id={"draggable" + buildId}>
            {quickDetails}
            <div className="BuildDetailSteps">
                {R.map(step => <BuildStep key={step.stepId} step={step} buildId={buildId}/>)(stepsToDisplay)}
            </div>
        </div>;
    }
}

BuildDetails.propTypes = {
    buildId: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    stepsToDisplay: PropTypes.array,
    stepToScroll: PropTypes.string,
    noScrollToStepFn: PropTypes.func.isRequired,
    openSubstepsFn: PropTypes.func.isRequired,
    buildDetails: PropTypes.object
};
export const mapStateToProps = (state, ownProps) => {
    const details = state.buildDetails[ownProps.buildId] || {};

    const stepsToDisplay = details.steps || null;
    const stateScroll = state.scrollToStep;

    let stepToScroll = null;
    if (stateScroll && stateScroll.scrollToStep && stateScroll.buildId === ownProps.buildId) {
        stepToScroll = stateScroll.stepId;
    }

    return {
        buildId: parseInt(ownProps.buildId),
        details: state.buildDetails[ownProps.buildId],
        stepsToDisplay: stepsToDisplay,
        open: state.openedBuilds[ownProps.buildId] || false,
        stepToScroll: stepToScroll,
        buildDetails: state.buildDetails[ownProps.buildId]
    };
};

export const mapDispatchToProps = (dispatch) => {

    return {
        noScrollToStepFn: () => dispatch(noScrollToStep()),
        openSubstepsFn: (buildId, stepId) => dispatch(openSubsteps(buildId, stepId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);