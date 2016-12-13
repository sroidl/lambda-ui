import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {requestDetailsPolling} from "./actions/BackendActions.es6";
import R from "ramda";
import BuildStep from "steps/BuildStep.es6";
import {makeDraggable} from "steps/HorizontalScroll.es6";
import QuickDetails from "details/QuickDetails.es6";
import DevToggle from "DevToggles.es6";
import "../../sass/buildDetails.sass";

export class BuildDetails extends React.Component {

    constructor(props) {
        super(props);
        this.registeredEventHandler = false;
    }

    componentDidUpdate() {
        if (this.props.open && !this.registeredEventHandler) {
            makeDraggable(this.props.buildId);
            this.registeredEventHandler = true;
        }
        if (!this.props.open) {
            this.registeredEventHandler = false;
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

        let quickDetails = "";
        if(DevToggle.useQuickBuildDetails){
            quickDetails = <QuickDetails buildId={buildId} />;
        }

        return <div id={"draggable" + buildId} className="BuildDetails">
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
    requestDetailsFn: PropTypes.func.isRequired,
    stepsToDisplay: PropTypes.array
};

export const mapStateToProps = (state, ownProps) => {
    const details = state.buildDetails[ownProps.buildId] || {};
    const stepsToDisplay = details.steps || null;

    return {
        buildId: parseInt(ownProps.buildId),
        details: state.buildDetails[ownProps.buildId],
        stepsToDisplay: stepsToDisplay,
        open: state.openedBuilds[ownProps.buildId] || false,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        requestDetailsFn: () => dispatch(requestDetailsPolling(ownProps.buildId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);