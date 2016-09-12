import React, {PropTypes} from "react";
import {connect} from "react-redux";
import Backend from "./Backend.es6";
import BuildStep from "./BuildStep.es6";
import R from "ramda";

export const BuildDetails = (props) => {
  const {buildId, open, details, requestDetailsFn} = props;
  if (!open) {
    return null;
  }

  if(!details) {
    requestDetailsFn();
    return <div className="twelve columns buildDetails">
              <div className="row loadingMessage">Loading build details</div>
           </div>;
  }


  const steps = R.map(step => <BuildStep key={step.stepId} buildId={buildId} step={step}/>)(details.steps);

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
    return {
    buildId: buildId,
    details: state.buildDetails[buildId],
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
