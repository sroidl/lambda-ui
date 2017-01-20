import R from "ramda";
import * as StepActions from "../actions/BuildStepActions.es6";
import * as BuildDetailAction from "../actions/BuildDetailActions.es6";
import {findPathToMostInterestingStep} from "../steps/InterestingStepFinder.es6";
import devToggles from "../DevToggles.es6";

export const toggleState = (oldState, buildId, stepId) => {
    const stepLens = R.lensPath([buildId, stepId]);
    const newState = R.over(stepLens, R.not, oldState);

    return newState;
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

export const showSubstepReducer = (oldState = {}, action) => {
    switch (action.type) {
        case StepActions.TOGGLE_SUBSTEPS: {
            return toggleState(oldState, action.buildId, action.stepId);
        }
        case StepActions.OPEN_SUBSTEPS: {
            const stepLens = R.lensPath([action.buildId, action.stepId]);
            return R.set(stepLens, true, oldState);
        }
        case StepActions.CLOSE_SUBSTEP: {
            const stepLens = R.lensPath([action.buildId, action.stepId]);
            return R.set(stepLens, false, oldState);
        }
        case StepActions.TOGGLE_FOLLOW: {
            const followLens = R.lensPath([action.buildId, "follow"]);
            const isFollow = R.pathOr(true, [action.buildId, "follow"])(oldState);
            return R.set(followLens, !isFollow, oldState);
        }
        case BuildDetailAction.ADD_BUILD_DETAILS: {
            if (devToggles.followBuild) {
                const followLens = R.lensPath([action.buildId, "follow"]);
                if (R.view(followLens, oldState)) {
                    const mostInterestingStep = findPathToMostInterestingStep(action.buildDetails, "root");

                    const builIdLens = R.lensProp([action.buildId]);
                    const mostInsterstingStepList = R.map(stepId => ({[stepId]: true}))(mostInterestingStep.path);
                    const newInnerState = R.merge(R.view(builIdLens, oldState), R.mergeAll(mostInsterstingStepList));
                    return R.set(builIdLens, newInnerState)(oldState);
                } else {
                    return oldState;
                }
                /* eslint-disable no-else-return */
            } else {
                return oldState;
            }
        }
        default:
            return oldState;
    }
};








