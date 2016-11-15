import React, {PropTypes} from "react";
import {connect} from "react-redux";
import BuildDetails from "./BuildDetails.es6";
import {toggleBuildDetails as toggleAction, viewBuildStep} from "actions/BuildDetailActions.es6";
import Moment, {now} from "moment";
import {StateIcon} from "StateIcon.es6";

import {FormattedDuration} from "./DateAndTime.es6";

export const renderSummary = (properties) => {
    const {buildId, buildNumber, startTime, state, toggleBuildDetails, open, showInterestingStep} = properties;
    let classesForState = "row buildSummary " + state;
    if (open) {
        classesForState += " open";
    }
    let {endTime} = properties;
    if (!endTime) {
        endTime = now();
    }

    const timeToNow = Moment(startTime).diff(Moment(now()));

    const startMoment = Moment.duration(timeToNow).humanize("minutes");
    const duration = Moment.duration(Moment(endTime).diff(Moment(startTime))).seconds();

    const openInterestingStep = () => {
        if (open) {
            toggleBuildDetails();
        }
        showInterestingStep();
    };

    const interestingStepLink = () => {
        if(["waiting", "running", "failed"].includes(state)){
            return <a href="#" onClick={openInterestingStep}>Show interesting step</a>;
        }
        return "";
    };


    return <div className={classesForState}>

        <div className="buildInfo" onClick={toggleBuildDetails}>
            <StateIcon state={state}/>
            <div className="buildInfoRow overview">
                <div className="buildNumber">Build #{buildNumber}</div>
            </div>
            <div className="buildInfoRow time">
                <div className="buildStartTime"><i className="fa fa-flag-checkered"
                                                   aria-hidden="true"></i>Started: {startMoment}</div>
                <div className="buildDuration"><i className="fa fa-clock-o" aria-hidden="true"></i>Duration:
                    <FormattedDuration seconds={duration}/></div>
            </div>
            <div className="buildInfoRow">
                <div>{interestingStepLink()}</div>
            </div>
        </div>
        <BuildDetails buildId={buildId}/>
    </div>;

};

export class BuildSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.state === "running") {
            setTimeout(() => this.forceUpdate(), 1000);
        }
        return renderSummary(this.props);
    }
}


BuildSummary.propTypes = {
    buildId: PropTypes.number.isRequired,
    buildNumber: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    toggleBuildDetails: PropTypes.func.isRequired,
    showInterestingStep: PropTypes.func,
    endTime: PropTypes.string,
    open: PropTypes.bool
};

export const mapStateToProps = (state, props) => {
    const {buildId, buildNumber, startTime, endTime} = props.build;
    const buildState = props.build.state;
    const open = state.openedBuilds[buildId] || false;

    return {
        buildId: buildId,
        buildNumber: buildNumber,
        state: buildState,
        startTime: startTime,
        endTime: endTime,
        open: open,
    };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleBuildDetails: () => {
            dispatch(toggleAction(ownProps.build.buildId));
        },
        showInterestingStep: () => {
            dispatch(viewBuildStep(ownProps.build.buildId, "__showInterestingStep"));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildSummary);