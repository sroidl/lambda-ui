import R from "ramda";
import * as StepActions from "../actions/BuildStepActions.es6";
import * as BuildDetailAction from "../actions/BuildDetailActions.es6";
import {findPathToMostInterestingStep} from "../steps/InterestingStepFinder.es6";
import * as OutputActions from "../actions/OutputActions.es6";

export const toggleState = (oldState, buildId, stepId) => {
    const stepLens = R.lensPath([buildId, stepId]);
    const newState = R.over(stepLens, R.not, oldState);
    const followLens = R.lensPath([buildId, "follow"]);

    return R.set(followLens, false, newState);
};

export const buildStepsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case StepActions.TOGGLE_STEP_TOOLBOX: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        default:
            return oldState;
    }
};

const disableFollow = (action) => {
    const followLens = R.lensPath([action.buildId, "follow"]);
    return R.set(followLens, false);
};

const setStep = (action, value) => {
    const stepLens = R.lensPath([action.buildId, action.stepId]);
    return R.set(stepLens, value);
};

const scrollToLens = action => R.lensPath([action.buildId, "scrollToStep"]);

const updateScrollTo = (newStep, oldState, action) => {
    const oldStep = R.path([action.buildId, "scrollToStep", "step"], oldState);
    if (newStep !== oldStep) {
        return {updated: true, step: newStep};
    }
    return {updated: false, step: oldStep};
};

export const showSubstepReducer = (oldState = {}, action) => {
    switch (action.type) {
        case StepActions.TOGGLE_SUBSTEPS: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        case StepActions.OPEN_SUBSTEPS: {
            return R.pipe(setStep(action, true), disableFollow(action))(oldState);
        }
        case StepActions.CLOSE_SUBSTEP: {
            return R.pipe(setStep(action, false), disableFollow(action))(oldState);
        }
        case StepActions.TOGGLE_FOLLOW: {
            const followLens = R.lensPath([action.buildId, "follow"]);
            return R.over(followLens, R.pipe(R.defaultTo(true), R.not), oldState);
        }

        case BuildDetailAction.ADD_BUILD_DETAILS: {
            const isFollow = R.pathOr(true, [action.buildId, "follow"], oldState);
            if (isFollow) {
                const defaultToEmpty = R.defaultTo({path: []});
                const pathToMostInterestingStep = defaultToEmpty(findPathToMostInterestingStep(action.buildDetails, "root"));
                const buildIdLens = R.lensProp([action.buildId]);
                const pathToMerge = R.map(stepId => ({[stepId]: true}))(pathToMostInterestingStep.path);
                const newInnerState = R.merge(R.view(buildIdLens, oldState), R.mergeAll(pathToMerge));

                const mostInterestingStep = R.last(pathToMostInterestingStep.path);
                return R.pipe(R.set(buildIdLens, newInnerState), R.set(scrollToLens(action), updateScrollTo(mostInterestingStep, oldState, action)))(oldState);
            }
            return oldState;
        }

        case OutputActions.SHOW_BUILD_OUTPUT: {
            return disableFollow(action)(oldState);
        }

        case BuildDetailAction.SCROLL_TO_STEP: {
            return disableFollow(action)(R.set(scrollToLens(action), {updated: true, step: action.stepId}, oldState));
        }
        case BuildDetailAction.NO_SCROLL_TO_STEP: {
            const updatedLens = R.lensPath([action.buildId, "scrollToStep", "updated"]);
            return R.set(updatedLens, false, oldState);
        }
        case BuildDetailAction.SHOW_SCROLL_INFO: {
            const scrollInfo = R.lensPath([action.buildId, "showScrollInfo"]);
            return R.set(scrollInfo, action.value, oldState);
        }

        default:
            return oldState;

    }
};








