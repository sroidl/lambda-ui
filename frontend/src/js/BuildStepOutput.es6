import React, {PropTypes} from "react";
import * as R from "ramda";
import {flatTree} from "./FunctionalUtils.es6";

export const BuildStepOutput = ({buildId, stepName, output, showOutput}) => {
  if (!showOutput) {
    return null;
  }

  return <div className="buildStepOutput">
  <div id="outputHeader">
    <span>Output of Build</span>
    <span id="outputHeader__buildId">{buildId}</span>
    <span>Step</span>
    <span id="outputHeader__stepName">{stepName}</span>
  </div>
  <div id="outputContent">{output}</div>
  </div>;
};

BuildStepOutput.propTypes = {
  buildId: PropTypes.number,
  stepName: PropTypes.string,
  output: PropTypes.array,
  showOutput: PropTypes.bool.isRequired
};

const outputHiddenProps = {showOutput: false};

const outputVisibleProps = (state, {buildId, stepId}) => {
  const buildDetails = state.buildDetails[buildId] || {};
  const step = flatTree(R.prop("steps"))(buildDetails)[stepId] || {};

  return {
    buildId: buildId,
    stepId: stepId,
    showOutput: true,
    stepName: step.name,
    output: step.output
  };
};

export const mapStateToProps = (state, props) => {
  const {showOutput} = state.output;
  if(showOutput) {
    return outputVisibleProps(state, props);
  }
  return outputHiddenProps;
};
