import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

export const BuildDetails = ({buildId, open, details}) => {
  if (!open) {
    return null;
  }

  if(details === undefined) {
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
  let open = state.openedBuilds[buildId] || false;
  let details = state.buildDetails[buildId];


  return {
    buildId: ownProps.buildId,
    details: details,
    open: open
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {return ownProps};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetails);
