import React, {PropTypes} from "react";
import Utils from "ComponentUtils.es6";
import {connect} from "react-redux";
import * as R from "ramda";
import {viewBuildStep} from "./actions/BuildDetailActions.es6";
import "../../sass/buildDetails.sass";
import {flatTree} from "./FunctionalUtils.es6";
import {getInterestingStepId, shouldShowInterestingStep} from "steps/InterestingStepFinder.es6";
import {toggleBuildDetails} from "actions/BuildDetailActions.es6";

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
        const {viewStepFn, closeBuildDetailsFn, steps} = this.props;

        const parentStepId = steps && steps.length > 1 ? steps[steps.length - 2].stepId : null;
        let onClickFn = () => viewStepFn(parentStepId);
        if(!steps || steps.length === 0){
            onClickFn = closeBuildDetailsFn;
        }

        const classesArrow = Utils.classes("arrowRight","levelUpArrow", !steps || steps.length === 0 ? "withoutParentSteps" : "");

        return <div className="levelUp" onClick={onClickFn}>
            <div className="levelUpIcon">
                <i className="fa fa-level-up fa-flip-horizontal"></i>
            </div>
            <div className={classesArrow}></div>
            <div className="breadConnectionVertical"></div>
            <div className="breadConnectionHorizontal"></div>
        </div>;
    }

    renderParentSteps() {
        const {steps} = this.props;

        if (!steps || steps.length === 0) {
            return <div></div>;
        }

        const stepsHtml = R.map(step => {
            return <div className="breadcrumbLink">
                <div className="inlineArrowRight"><div className="arrowRight parentStepArrow inlineArrowAbsolut"></div><div className="arrowRight parentStepArrow inlineArrowWhite"></div></div>
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

        const classesArrow = Utils.classes("arrowRight","parentStepArrow", !steps || steps.length === 0 ? "withoutParentSteps" : "");

        return <div className="currentStep">
            <div className={classesArrow}></div>
            <div className="currentText">{currentLink}</div>
        </div>;
    }

    renderCurrentArrow() {
        return <div className="arrowRight currentStepArrow"></div>;
    }

    render() {
        return <div className="buildDetailBreadcrumb">
            {this.renderLevelUpIcon()}
            {this.renderParentSteps()}
            {this.renderCurrentStep()}
            {this.renderCurrentArrow()}
        </div>;
    }
}

BuildDetailBreadcrumb.propTypes = {
    steps: PropTypes.array,
    buildId: PropTypes.number.isRequired,
    viewStepFn: PropTypes.func.isRequired,
    showParentStepsFn: PropTypes.func.isRequired,
    closeBuildDetailsFn: PropTypes.func.isRequired
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

    return {
        buildId: buildId,
        steps: calculateBreadcrumb(buildDetails, currentViewStepId)
    };
};

export const mapDispatchToProps = (dispatch, {buildId}) => {
    return {
        viewStepFn: (stepId) => dispatch(viewBuildStep(buildId, stepId)),
        closeBuildDetailsFn: () => dispatch(toggleBuildDetails(buildId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailBreadcrumb);