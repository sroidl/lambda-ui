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

export class BuildDetailBreadcrumb extends React.Component {

    constructor(props) {
        super(props);
    }

    clickFn(stepId) {
        return () => this.props.viewStepFn(stepId);
    }

    getRootLink() {
        return <BreadcrumbLink clickFn={this.clickFn("root")} name={"Build " + this.props.buildId}/>;
    }

    getStepLink(step) {
        return <BreadcrumbLink clickFn={this.clickFn(step.stepId)} name={step.name}/>;
    }

    renderLevelUpIcon() {
        const {viewStepFn, steps} = this.props;

        const parentStepId = steps && steps.length > 1 ? steps[steps.length - 2].stepId : null;
        return <div className="levelUp" onClick={() => viewStepFn(parentStepId)}>
            <div className="levelUpIcon">
                <i className="fa fa-level-up fa-flip-horizontal"></i>
            </div>
            <div className="arrowRight levelUpArrow"></div>
            <div className="breadConnectionVertical"></div>
            <div className="breadConnectionHorizontal"></div>
        </div>;
    }

    renderParentStepIcon() {
        const {showParentStepBreadcrumb, steps, showParentStepsFn} = this.props;

        if (showParentStepBreadcrumb || !steps || steps.length === 0) {
            return <div></div>;
        }
        return <div className="parentStepIcon" onClick={showParentStepsFn}>
            <i className="fa fa-ellipsis-h"></i>
        </div>;
    }

    renderParentSteps() {
        const {steps, showParentStepBreadcrumb} = this.props;

        if (!showParentStepBreadcrumb || !steps || steps.length === 0) {
            return <div></div>;
        }

        const stepsHtml = R.map(step => {
            return <div className="breadcrumbLink">
                <div className="inlineArrowRight">&nbsp;>&nbsp;</div>
                {this.getStepLink(step)}
            </div>;
        })(steps.slice(0, steps.length - 1));

        return <div className="parentSteps">{this.getRootLink()}{stepsHtml}</div>;

    }

    renderCurrentStep() {
        const {steps} = this.props;

        let currentLink = this.getRootLink();
        if (steps && steps.length > 0) {
            currentLink = this.getStepLink(steps[steps.length - 1]);
        }

        return <div className="currentStep">
            <div className="arrowRight parentStepArrow"></div>
            <div className="currentText">{currentLink}</div>
        </div>;
    }

    renderCurrentArrow() {
        return <div className="arrowRight currentStepArrow"></div>;
    }

    render() {
        return <div className="buildDetailBreadcrumb">
            {this.renderLevelUpIcon()}
            {this.renderParentStepIcon()}
            {this.renderParentSteps()}
            {this.renderCurrentStep()}
            {this.renderCurrentArrow()}
        </div>;
    }
}

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