import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {viewBuildStep} from "./Actions.es6";
import "../sass/buildDetails.sass";

export const BuildDetailBreadcrumb = ({buildId, steps, viewStepFn}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  const GT = ">";
  const clickFn = step => () => viewStepFn(buildId, step.stepId);
  const stepHtmlId = step => "bcrumb-" + buildId + "-" + step.stepId;
  const stepHtml = (step) =>
   <a href="#" className="breadCrumbLink" id={stepHtmlId(step)} onClick={clickFn(step)}>{step.name}</a>;

  const stepsHtml = R.map(step => {
    return <span key={step.name}> {GT} {stepHtml(step)}</span>;
  })(steps);

  return <div className="buildDetailBreadcrumb">
    {stepsHtml}
   </div>;
};

BuildDetailBreadcrumb.propTypes = {
  steps: PropTypes.array,
  buildId: PropTypes.number.isRequired,
  viewStepFn: PropTypes.func.isRequired
};

const conmap = fn => (acc, child) => R.concat(acc, fn(child));
const flatTree = stepDownFn =>
      input => { return stepDownFn(input) ? R.reduce(conmap(flatTree(stepDownFn)),[input], stepDownFn(input)) : [input]; };
const safeSteps = input => {return input ? input : [];};
export const expandParents = flatTree(parent => R.map(step => Object.assign(step, {parentId: parent.stepId}), safeSteps(parent.steps)));

export const calculateBreadcrumb = (buildDetails, currentViewStepId) => {
if (!buildDetails.stepId) {
  buildDetails.stepId = "root";
}
  const allSteps = R.pipe(expandParents, R.indexBy(R.prop("stepId")));

  const expandBreadcrumb = (currentId, allSteps) => {
    const currentStep = allSteps[currentId];
    const result = currentStep ? [expandBreadcrumb(currentStep.parentId, allSteps), currentStep] : [];
    return R.chain(R.identity, result);
  };

  const objects = R.project(["name", "stepId"])(expandBreadcrumb(currentViewStepId, allSteps(buildDetails)));
  const allButRoot = R.tail(objects);
  return allButRoot;
};

export const mapStateToProps = (state, {buildId}) => {
  const buildDetails = Object.assign({},state.buildDetails[buildId]);
  const currentViewStepId = state.viewBuildSteps[buildId];
  // currentViewStepId = currentViewStepId? currentViewStepId : "root";

  return {
    buildId: buildId,
    steps: calculateBreadcrumb(buildDetails, currentViewStepId)
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
     viewStepFn : (buildId, stepId) => dispatch(viewBuildStep(buildId,stepId))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailBreadcrumb);
