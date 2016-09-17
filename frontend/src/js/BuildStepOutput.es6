import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {flatTree} from "./FunctionalUtils.es6";
import {requestOutput} from "./Actions.es6";

export const BuildStepOutput = (props) => {
  const {buildId, stepName, showOutput, requestFn, stepId} = props;
  let {output} = props;

  if (!showOutput) {
    return null;
  }
  if(!output) {
    requestFn(buildId, stepId);
    output = <span>Requesting Output from Server</span>;
  }

  return <div className="buildStepOutput">
  <div id="outputHeader">
    <span>Output of Build </span>
    <span id="outputHeader__buildId">{buildId}</span>
    <span> Step </span>
    <span id="outputHeader__stepName">{stepName}</span>
  </div>
  <div id="outputContent">{output}</div>
  </div>;
};

BuildStepOutput.propTypes = {
  buildId: PropTypes.number,
  stepName: PropTypes.string,
  output: PropTypes.array,
  showOutput: PropTypes.bool,
  requestFn: PropTypes.func,
  stepId: PropTypes.string
};

const outputHiddenProps = {showOutput: false};

const outputVisibleProps = (state) => {
  const buildId = state.output.buildId;
  const stepId = state.output.stepId;
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

export const mapStateToProps = (state) => {
  const {showOutput} = state.output;
  if(showOutput) {
    return outputVisibleProps(state);
  }
  return outputHiddenProps;
};

export const mapDispatchToProps = (dispatch) => {
  return {requestFn: (buildId, stepId) => dispatch(requestOutput(buildId,stepId))};
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildStepOutput);
