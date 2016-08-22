import React from 'react';
import { connect } from 'react-redux';
import BuildSummary from './BuildSummary.es6'

const BuildSummaryListPresentation = ({builds}) => {

  let result = [];
  for (let buildId in builds) {
    let build = builds[buildId];
    result.push(
    <BuildSummary key={buildId} buildId={buildId} build={build}/>);
  }

  return <div>
    {result}
  </div>
};

const mapStateToProps = (state) => {return {builds: state.builds}};
const mapDispatchToProps = (state) => {return {}};
const BuildSummaryList = connect(mapStateToProps, mapDispatchToProps)(BuildSummaryListPresentation);

export default BuildSummaryList;
