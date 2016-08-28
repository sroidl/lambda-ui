import React, { Component } from 'react';
import { connect } from 'react-redux';
import BuildDetails from './BuildDetails.es6'
import {toggleBuildDetails as toggleAction} from './Actions.es6'


const BuildSummaryPresentation = ({buildId, build, toggleBuildDetails}) =>{

    let classesForState = "row buildSummary " + build.state;

    return <div className={classesForState}>
        <div className="one column buildIcon">?</div>
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

const BuildSummary = connect(
  mapStateToProps,
  mapDispatchToProps)(BuildSummaryPresentation);

export default BuildSummary;
