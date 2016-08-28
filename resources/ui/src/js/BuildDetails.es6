import React from 'react';
import { connect } from 'react-redux';

const BuilDetailsPresentation = ({build, open}) => {
  if (!open) {
    return null;
  }

  return <div className="twelve columns buildDetails">
            <div className="row marker">Hier kommen die Details</div>
         </div>
};

const mapStateToProps = (state, ownProps) => {
  let buildId = ownProps.build.buildId;
  let open = state.openedBuilds[buildId] || false;
  return {
    build: ownProps.build,
    open: open
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {return ownProps};
const BuildDetails = connect(mapStateToProps, mapDispatchToProps)(BuilDetailsPresentation);
export default BuildDetails;
