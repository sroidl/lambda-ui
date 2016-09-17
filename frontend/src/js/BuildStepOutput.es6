import React, {PropTypes} from "react";

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
  buildId: PropTypes.number.isRequired,
  stepName: PropTypes.string.isRequired,
  output: PropTypes.string,
  showOutput: PropTypes.bool.isRequired
};
