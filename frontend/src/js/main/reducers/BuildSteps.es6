import R from "ramda";
import * as StepActions from "../actions/BuildStepActions.es6";
import * as BuildDetailAction from "../actions/BuildDetailActions.es6";
import {findPathToMostInterestingStep} from "../steps/InterestingStepFinder.es6";
import devToggles from "../DevToggles.es6";
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
            if (devToggles.followBuild) {
                const isFollow = R.pathOr(true, [action.buildId, "follow"], oldState);
                if (isFollow) {
                    const mostInterestingStep = findPathToMostInterestingStep(action.buildDetails, "root");

                    const builIdLens = R.lensProp([action.buildId]);
                    const mostInsterstingStepList = R.map(stepId => ({[stepId]: true}))(mostInterestingStep.path);
                    const newInnerState = R.merge(R.view(builIdLens, oldState), R.mergeAll(mostInsterstingStepList));
                    return R.set(builIdLens, newInnerState)(oldState);
                /* eslint-disable no-else-return */
                } else {
                    return oldState;
                }
            } else {
                return oldState;
            }
        }

        case OutputActions.SHOW_BUILD_OUTPUT: {
           return disableFollow(action)(oldState);

        }

        default:
            return oldState;
    }
};








