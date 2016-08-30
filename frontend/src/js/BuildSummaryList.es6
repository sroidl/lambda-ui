import React from 'react';
import { connect } from 'react-redux';
import BuildSummary from './BuildSummary.es6'

export const BuildSummaryList = ({builds}) => {

  let result = [];
  for (let buildId in builds) {
    let build = builds[buildId];
    result.push(
    <BuildSummary key={buildId} build={build}/>);
  }

  return <div>{result}</div>
};

const mapStateToProps = (state) => {return {builds: state.summaries}};
const mapDispatchToProps = (state) => {return {}};

export default connect(mapStateToProps, mapDispatchToProps)(BuildSummaryList);
