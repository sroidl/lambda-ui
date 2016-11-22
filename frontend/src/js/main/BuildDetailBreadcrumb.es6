import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";
import {viewBuildStep} from "./actions/BuildDetailActions.es6";
import "../../sass/buildDetails.sass";
import {flatTree} from "./FunctionalUtils.es6";
import {getInterestingStepId, shouldShowInterestingStep} from "steps/InterestingStepFinder.es6";
import {toggleParentSteps} from "actions/BuildDetailBreadcrumbActions.es6";

export const BreadcrumbLink = ({clickFn, name}) => {
    return <div id={name} className="breadcrumbLink" onClick={clickFn}>{name}</div>;
};

BreadcrumbLink.propTypes = {
    clickFn: PropTypes.func,
    name: PropTypes.string.isRequired
};

export const BuildDetailBreadcrumb = ({buildId, steps, viewStepFn, showParentStepsFn, showParentStepBreadcrumb}) => {
    const parentStepId = steps && steps.length > 1 ? steps[steps.length - 2].stepId : null;

    const levelUp = <div className="levelUp" onClick={() => viewStepFn(parentStepId)}><div className="levelUpIcon"><i className="fa fa-level-up fa-flip-horizontal"></i></div><div className="arrowRight levelUpArrow"></div></div>;

    const clickFn = stepId => () => viewStepFn(stepId);

    const rootLink = <BreadcrumbLink clickFn={clickFn("root")} name={"Build " + buildId}/>;

    const stepHtml = (step) => <BreadcrumbLink clickFn={clickFn(step.stepId)} name={step.name} />;

    const stepsHtml = R.map(step => {
        return <div className="breadcrumbLink">
            <div className="inlineArrowRight">&nbsp;>&nbsp;</div>
            {stepHtml(step)}
        </div> ;
    })(steps.slice(0, steps.length - 1));


    const parentStepIcon = () => {
        if(showParentStepBreadcrumb || !steps || steps.length === 0){
            return <div></div>;
        }
        return <div className="parentStepIcon" onClick={showParentStepsFn}><i className="fa fa-ellipsis-h"></i></div>;
    };
    const currentStep = currentLink => <div className="currentStep"><div className="arrowRight parentStepArrow"></div><div className="currentText">{currentLink}</div></div>;
    const currentArrow = <div className="arrowRight currentStepArrow"></div>;


    if (!steps || steps.length === 0) {
        return <div className="buildDetailBreadcrumb">{levelUp}{parentStepIcon()}{currentStep(rootLink)}{currentArrow}</div>;
    }

    const parentSteps = showParentStepBreadcrumb ? <div className="parentSteps">{rootLink}{stepsHtml}</div> : <div></div>;

    return <div className="buildDetailBreadcrumb">
        {levelUp}{parentStepIcon()}{parentSteps}{currentStep(stepHtml(steps[steps.length - 1]))}{currentArrow}
    </div>;
};

BuildDetailBreadcrumb.propTypes = {
    steps: PropTypes.array,
    buildId: PropTypes.number.isRequired,
    showParentStepBreadcrumb: PropTypes.bool.isRequired,
    viewStepFn: PropTypes.func.isRequired,
    showParentStepsFn: PropTypes.func.isRequired
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
    const currentViewStepId = shouldShowInterestingStep(state, buildId) ? getInterestingStepId(state, buildId) : state.viewBuildSteps[buildId] || null;
    const showParentStepBreadcrumb = state.showParentStepBreadcrumb[buildId] || false;

    return {
        buildId: buildId,
        steps: calculateBreadcrumb(buildDetails, currentViewStepId),
        showParentStepBreadcrumb: showParentStepBreadcrumb
    };
};

export const mapDispatchToProps = (dispatch, {buildId}) => {
    return {
        viewStepFn: (stepId) => dispatch(viewBuildStep(buildId, stepId)),
        showParentStepsFn: () => dispatch(toggleParentSteps(buildId))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailBreadcrumb);





