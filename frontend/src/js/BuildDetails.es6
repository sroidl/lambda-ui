import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Backend from "./Backend.es6";
import BuildStep from "./BuildStep.es6";
import R from "ramda";

export const BuildDetails = (props) => {
  const {buildId, open, stepsToDisplay, requestDetailsFn} = props;
  if (!open) {
    return null;
  }

  if(!stepsToDisplay) {
    requestDetailsFn();
    return <div className="twelve columns buildDetails">
              <div className="row loadingMessage">Loading build details</div>
           </div>;
  }


  const steps = R.map(step => <BuildStep key={step.stepId} buildId={buildId} step={step}/>)(stepsToDisplay);

  return <div className="twelve columns buildDetails">
            <div className="row ">{steps}</div>
         </div>;
};

BuildDetails.propTypes = {
  buildId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  requestDetailsFn: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const buildId = Number.parseInt(ownProps.buildId);
  const details = state.buildDetails[buildId] || {};
  const stepsToDisplay = details.steps;

    return {
    buildId: buildId,
    details: state.buildDetails[buildId],
    stepsToDisplay: stepsToDisplay,
    open: state.openedBuilds[buildId] || false
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      requestDetailsFn: () => {
        Backend.requestBuildDetails(dispatch, ownProps.buildId);
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);
