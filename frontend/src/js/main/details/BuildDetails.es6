import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {requestDetailsPolling} from "../actions/BackendActions.es6";
import {noScrollToStep} from "../actions/BuildDetailActions.es6";
import R from "ramda";
import BuildStep from "../steps/BuildStep.es6";
import {makeDraggable, scrollToStep} from "../steps/HorizontalScroll.es6";
import QuickDetails from "../details/QuickDetails.es6";
import "../../../sass/buildDetails.sass";

export class BuildDetails extends React.Component {

    constructor(props) {
        super(props);
        this.registeredEventHandler = false;
    }

    componentDidUpdate() {
        const {open, buildId, stepToScroll, noScrollToStepFn} = this.props;

        if (open && !this.registeredEventHandler) {
            makeDraggable(buildId);
            this.registeredEventHandler = true;
        }
        if (!open) {
            this.registeredEventHandler = false;
        }
        if (stepToScroll){
            scrollToStep(buildId, stepToScroll);
            noScrollToStepFn();
        }
    }

    render() {
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

        const quickDetails = <QuickDetails buildId={buildId} />;

        return <div className="BuildDetails">
            {quickDetails}
            <div className="BuildDetailSteps" id={"draggable" + buildId}>
                {R.map(step => <BuildStep key={step.stepId} step={step} buildId={buildId}/>)(stepsToDisplay)}
            </div>
        </div>;
    }
}

BuildDetails.propTypes = {
    buildId: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    requestDetailsFn: PropTypes.func.isRequired,
    stepsToDisplay: PropTypes.array,
    stepToScroll: PropTypes.string,
    noScrollToStepFn: PropTypes.func.isRequired
};

export const mapStateToProps = (state, ownProps) => {
    const details = state.buildDetails[ownProps.buildId] || {};
    const stepsToDisplay = details.steps || null;
    const stateScroll = state.scrollToStep;
    let stepToScroll = null;
    if(stateScroll && stateScroll.scrollToStep && stateScroll.buildId === ownProps.buildId){
        stepToScroll = stateScroll.stepId;
    }

    return {
        buildId: parseInt(ownProps.buildId),
        details: state.buildDetails[ownProps.buildId],
        stepsToDisplay: stepsToDisplay,
        open: state.openedBuilds[ownProps.buildId] || false,
        stepToScroll: stepToScroll
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        requestDetailsFn: () => dispatch(requestDetailsPolling(ownProps.buildId)),
        noScrollToStepFn: () => dispatch(noScrollToStep())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);