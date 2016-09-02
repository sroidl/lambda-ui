import React, {PropTypes  } from 'react';
import {connect} from 'react-redux';
import BuildDetails from './BuildDetails.es6'
import {toggleBuildDetails as toggleAction} from './Actions.es6'
import Moment, {now} from 'moment'
import "moment-duration-format";

const SUCCESS_ICON = 'fa-check'
const FAILURE_ICON = 'fa-times'
const RUNNING_ICON = 'fa-cog'


const icon = (buildState) => {
  switch (buildState) {
    case "success" : return SUCCESS_ICON;
    case "failed" : return FAILURE_ICON;
    case "running" : return RUNNING_ICON;
    default : return '';
  }
}

const formatSeconds = (input) => {
  const duration = Moment.duration(input.seconds(), 'seconds');

  if (duration.seconds() === 0) {
    return "";
  }
  else if (duration.seconds() === 1) {
    return "1 second";
  }
  else if (duration.seconds() < 10) {
    return duration.format("s") + " seconds"
  }
  else {
    return duration.format("ss") + " seconds";
  }
}

const formatMinutes = (input) => {
  const duration = Moment.duration(input.minutes(), 'minutes')

  if (duration.minutes() === 0) {
    return "";
  }
  else if (duration.minutes() === 1) {
    return "1 minute";
  }
  else if (duration.minutes() < 10) {
    return duration.format("m") + " minutes"
  }
  else {
    return duration.format("mm") + " minutes";
  }
}

const formatHours = (duration) => {
  if (duration.hours() === 0) {
    return "";
  }
  else if (duration.hours() === 1) {
    return "1 hour";
  }
  else if (duration.hours() < 10) {
    return duration.format("h") + " hours"
  }
  else {
    return duration.format("hh") + " hours";
  }
}



const formatDuration = seconds =>{
  const duration = Moment.duration(seconds, 'seconds');
  const minutes = duration.minutes();



  const formatted = formatHours(duration) + " " + formatMinutes(duration) + " " + formatSeconds(duration)
  return formatted.trim();
}

export const BuildSummary = (props) =>{
    let {buildId, build, buildNumber, startTime, state, duration, toggleBuildDetails} = props;
    let classesForState = "row buildSummary " + state;
    let iconClassName = "fa " + icon(state);

    const startMoment = Moment(startTime);
    let time = startMoment.format("hh:mma");
    let date = startMoment.format("dd Mo MMM");
    let duration_new = formatDuration(duration);


    return <div className={classesForState}>
        <div className="one column buildIcon"><i className={iconClassName} aria-hidden="true"></i></div>
        <div className="three columns buildNumber">Build #{buildNumber}</div>
        <div className="three columns buildStartTime">Started: {time} {date}</div>
        <div className="three columns buildDuration">Duration: {duration_new}</div>
        <a href="#" className="one column buildDetailsToggle" onClick={toggleBuildDetails}>v</a>
        <BuildDetails buildId={buildId}/>
      </div>

}

BuildSummary.propTypes = {
  buildId: PropTypes.number.isRequired,
  buildNumber: PropTypes.number.isRequired,
  state: PropTypes.string.isRequired,
  startTime: PropTypes.object.isRequired,
  duration: PropTypes.number.isRequired,
  toggleBuildDetails: PropTypes.func.isRequired
}

export const mapStateToProps = (state, props) => {


  let build = props.build;

  return {
    buildId: build.buildId,
    buildNumber: build.buildNumber,
    state: build.state,
    startTime: build.startTime,
    duration: build.duration,
    }
}

export const mapDispatchToProps = (dispatch, ownProps) =>  {
  return {
    toggleBuildDetails: () => {
      dispatch(toggleAction(ownProps.build.buildId))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BuildSummary);
