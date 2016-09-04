import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

export const BuildDetails = ({buildId, open, details, requestDetailsFn}) => {
  if (!open) {
    return null;
  }

  if(details === undefined) {
    console.log("Requesting build details for Build", buildId);
    if (requestDetailsFn != undefined){
      requestDetailsFn();
    }
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
  let buildId = ownProps.buildId;
    return {
    buildId: ownProps.buildId,
    details: state.buildDetails[buildId],
    open: state.openedBuilds[buildId] || false
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return ownProps
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);
