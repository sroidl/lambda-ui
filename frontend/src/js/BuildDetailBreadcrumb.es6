import React, {PropTypes} from "react";
import * as R from "ramda";
import "../sass/buildDetails.sass";

export const BuildDetailBreadcrumb = ({steps}) => {
  if (!steps || steps.length === 0) {
    return <div className="buildDetailBreadcrumb">&gt;</div>;
  }

  const stepsHtml = R.map(step => {
    return <span key={step.stepName}> &gt; {step.stepName}</span>;
  })(steps);

  return <div className="buildDetailBreadcrumb">
    {stepsHtml}
   </div>;
};

BuildDetailBreadcrumb.propTypes = {
  steps: PropTypes.array,
  buildId: PropTypes.number.isRequired
};

const conmap = fn => (acc, child) => R.concat(acc, fn(child));
const flatTree = stepDownFn =>
      input => { return stepDownFn(input) ? R.reduce(conmap(flatTree(stepDownFn)),[input], stepDownFn(input)) : [input]; };
const safeSteps = input => {return input ? input : [];};
export const expandParents = flatTree(parent => R.map(step => Object.assign(step, {parentId: parent.stepId}), safeSteps(parent.steps)));

export const calculateBreadcrumb = (buildDetails, currentViewStepId) => {
  const allSteps = R.pipe(expandParents, R.indexBy(R.prop("stepId")));

  const expandBreadcrumb = (currentId, allSteps) => {
    const currentStep = allSteps[currentId];
    const result = currentStep ? [expandBreadcrumb(currentStep.parentId, allSteps), currentStep] : [];
    return R.chain(id => id, result);
  };

  const objects = R.project(["stepName", "stepId"])(expandBreadcrumb(currentViewStepId, allSteps(buildDetails)));

  return objects;
};
