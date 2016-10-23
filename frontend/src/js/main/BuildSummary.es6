import React, {PropTypes} from "react";
import {connect} from "react-redux";
import BuildDetails from "./BuildDetails.es6";
import {toggleBuildDetails as toggleAction} from "./Actions.es6";
import Moment, {now} from "moment";

import {FormattedDuration} from "./DateAndTime.es6";

const SUCCESS_ICON = "fa-check";
const FAILURE_ICON = "fa-times";
const RUNNING_ICON = "fa-cog";


const icon = (buildState) => {
    switch (buildState) {
        case "success" :
            return SUCCESS_ICON;
        case "failed" :
            return FAILURE_ICON;
        case "running" :
            return RUNNING_ICON;
        default :
            return "";
    }
};


export const renderSummary = (properties) => {
    const {buildId, buildNumber, startTime, state, toggleBuildDetails} = properties;
    const classesForState = "row buildSummary " + state;
    const iconClassName = "fa " + icon(state);
    let {endTime} = properties;
    if (!endTime) {
        endTime = now();
    }


    const timeToNow = Moment(startTime).diff(Moment(now()));

    const startMoment = Moment.duration(timeToNow).humanize("minutes");
    const duration = Moment.duration(Moment(endTime).diff(Moment(startTime))).seconds();
    const durationHtml = <div className="three columns buildDuration">
        <span>Duration:</span><FormattedDuration seconds={duration}/></div>;

    return <div className={classesForState}>

        <div className="buildInfo" onClick={toggleBuildDetails}>
            <div className="buildIcon"><i className={iconClassName} aria-hidden="true"></i></div>
            <div className="three columns buildNumber">Build #{buildNumber}</div>
            <div className="three columns buildStartTime">Started: {startMoment}</div>
            {durationHtml}
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
    endTime: PropTypes.string
};

export const mapStateToProps = (_, props) => {
    const {buildId, buildNumber, state, startTime, endTime} = props.build;

    return {
        buildId: buildId,
        buildNumber: buildNumber,
        state: state,
        startTime: startTime,
        endTime: endTime
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
