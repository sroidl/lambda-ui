import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

export const BuilDetails = ({buildId, open}) => {
  if (!open) {
    return null;
  }

  return <div className="twelve columns buildDetails">
            <div className="row marker">Hier kommen die Details</div>
         </div>
};

BuilDetails.propTypes = {
  buildId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  let buildId = ownProps.buildId;
  let open = state.openedBuilds[buildId] || false;

  return {
    buildId: ownProps.buildId,
    open: open
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {return ownProps};

export default connect(mapStateToProps, mapDispatchToProps)(BuilDetails);
