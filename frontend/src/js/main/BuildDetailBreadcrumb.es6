import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {viewBuildStep} from "./Actions.es6";
import "../../sass/buildDetails.sass";
import {flatTree} from "./FunctionalUtils.es6";

export const BuildDetailBreadcrumb = ({buildId, steps, viewStepFn}) => {
    const clickFn = stepId => () => viewStepFn(buildId, stepId);
    const rootLink = <a href="#" onClick={clickFn("root")}>Build {buildId}</a>;

    if (!steps || steps.length === 0) {
        return <div className="buildDetailBreadcrumb">{rootLink}</div>;
    }

    const GT = ">";
    const stepHtmlId = step => "bcrumb-" + buildId + "-" + step.stepId;
    const stepHtml = (step) =>
        <a href="#" className="breadCrumbLink" id={stepHtmlId(step)} onClick={clickFn(step.stepId)}>{step.name}</a>;

    const stepsHtml = R.map(step => {
        return <span key={step.name}> {GT} {stepHtml(step)}</span>;
    })(steps);

    return <div className="buildDetailBreadcrumb">
        {rootLink}{stepsHtml}
    </div>;
};

BuildDetailBreadcrumb.propTypes = {
    steps: PropTypes.array,
    buildId: PropTypes.number.isRequired,
    viewStepFn: PropTypes.func.isRequired
};


const safeSteps = input => {
    return input ? input : [];
};
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
    const buildDetails = Object.assign({}, state.buildDetails[buildId]);
    const currentViewStepId = state.viewBuildSteps[buildId];
    // currentViewStepId = currentViewStepId? currentViewStepId : "root";

    return {
        buildId: buildId,
        steps: calculateBreadcrumb(buildDetails, currentViewStepId)
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        viewStepFn: (buildId, stepId) => dispatch(viewBuildStep(buildId, stepId))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailBreadcrumb);
