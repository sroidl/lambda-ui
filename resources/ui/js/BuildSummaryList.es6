import React from 'react';
import { connect } from 'react-redux'

const BuildSummaryListPresentation = ({builds}) => (
  <div>
    {builds.map(build =>
      <div key={build.id}>
        Build Id: {build.id} <br/>
        Build State: {build.state}<br/>
      </div>
    )}
  </div>
);

const mapStateToProps = (state) => {return {builds: state.builds}};
const mapDispatchToProps = (state) => {return {}};
const BuildSummaryList = connect(mapStateToProps, mapDispatchToProps)(BuildSummaryListPresentation);

export default BuildSummaryList;
