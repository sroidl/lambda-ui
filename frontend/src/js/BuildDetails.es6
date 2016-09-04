import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Backend from './Backend.es6';

export const BuildDetails = (props) => {
  let {buildId, open, details, requestDetailsFn} = props
  if (!open) {
    return null;
  }

  if(details === undefined) {
    requestDetailsFn();
    return <div className="twelve columns buildDetails">
              <div className="row loadingMessage">Loading build details</div>
           </div>
  }

  return <div className="twelve columns buildDetails">
            <div className="row ">Hier kommen die Details</div>
         </div>
};

BuildDetails.propTypes = {
  buildId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let buildId = Number.parseInt(ownProps.buildId);
    return {
    buildId: buildId,
    details: state.buildDetails[buildId],
    open: state.openedBuilds[buildId] || false
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      requestDetailsFn: ()=>{
        Backend.requestBuildDetails(dispatch, ownProps.buildId);
      }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);
