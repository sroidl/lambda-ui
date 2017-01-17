import React, {PropTypes} from "react";
import R from "ramda";
import {connect} from "react-redux";
import BuildDetails from "./details/BuildDetails.es6";
import {toggleBuildDetails as toggleAction} from "actions/BuildDetailActions.es6";
import Moment, {now} from "moment";
import {StateIcon} from "./StateIcon.es6";
import {FormattedDuration} from "./DateAndTime.es6";

export const renderSummary = (properties) => {
    const {buildId, buildNumber, startTime, state, toggleBuildDetails, open, duration} = properties;
    let classesForState = "row buildSummary " + state;
    if (open) {
        classesForState += " open";
    }

    const timeToNow = Moment(startTime).diff(Moment(now()));
    const startMoment = Moment.duration(timeToNow);
    const startText = R.isNil(startTime) ? "not yet started" : startMoment.humanize("minutes");
    const startTextTooltip = R.isNil(startTime) ? "not yet started" : Moment(startTime).format("dddd, MMMM Do YYYY, h:mm:ss a");

    return <div className={classesForState}>
        <div className="buildInfo" onClick={toggleBuildDetails}>
            <StateIcon state={state}/>
            <div className="buildInfoRow overview">
                <div className="buildNumber">Build #{buildNumber}</div>
            </div>
            <div className="buildInfoRow time">
                <div className="buildStartTime" title={startTextTooltip}><i className="fa fa-flag-checkered"
                                                   aria-hidden="true"></i>Started: {startText}</div>
                <div className="buildDuration"><i className="fa fa-clock-o" aria-hidden="true"></i>Duration:
                    <FormattedDuration seconds={duration}/></div>
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
    startTime: PropTypes.string,
    toggleBuildDetails: PropTypes.func.isRequired,
    endTime: PropTypes.string,
    duration: PropTypes.number,
    open: PropTypes.bool
};

export const mapStateToProps = (state, props) => {
    const {buildId, buildNumber, startTime, endTime, duration} = props.build;
    const buildState = props.build.state;
    const open = state.openedBuilds[buildId] || false;

    return {
        buildId: buildId,
        buildNumber: buildNumber,
        state: buildState,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        open: open
    };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        toggleBuildDetails: () => {
            dispatch(toggleAction(ownProps.build.buildId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildSummary);