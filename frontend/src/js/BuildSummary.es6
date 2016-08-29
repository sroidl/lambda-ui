import React from 'react';
import {connect} from 'react-redux';
import BuildDetails from './BuildDetails.es6'
import {toggleBuildDetails as toggleAction} from './Actions.es6'

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

export const BuildSummary = ({buildId, build, toggleBuildDetails}) =>{

    let classesForState = "row buildSummary " + build.state;

    let iconClassName = "fa " + icon(build.state);

    return <div className={classesForState}>
        <div className="one column buildIcon"><i className={iconClassName} aria-hidden="true"></i></div>
        <div className="three columns buildNumber">Build #{build.buildNumber}</div>
        <div className="three columns buildStartTime">Started: {build.startTime}</div>
        <div className="three columns buildDuration">Duration: {build.duration}</div>
        <a href="#" className="one column buildDetailsToggle" onClick={toggleBuildDetails}>v</a>
        <BuildDetails build={build}/>
      </div>

}

const mapStateToProps = (state, ownProps) => {

  let buildId = ownProps.buildId;
  let build = state.summaries[buildId];

  return {
      build: build,
      buildId: buildId
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>  {
  return {
    toggleBuildDetails: () => {
      dispatch(toggleAction(ownProps.buildId))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BuildSummary);
