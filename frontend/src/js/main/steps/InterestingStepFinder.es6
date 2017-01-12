import R from "ramda";
import * as Utils   from "../Utils.es6";

export const shouldShowInterestingStep = (state, buildId) => {
    if (!state.viewBuildSteps) {
        return false;
    }
    return state.viewBuildSteps[buildId] === "__showInterestingStep";
};

const filterStepsById = stepId => R.filter(step => step.stepId === stepId);

const traverseChildren = (state, path, step) => {

    if (step.state !== state) {
        return null;
    }

    const newPath = R.append(step.stepId, path);

    const isNotNil = x => !R.isNil(x);
    const curriedFindDeepest = R.curry(traverseChildren)(state, newPath);
    const result = R.map(curriedFindDeepest)(step.steps);
    const firstNonNilResult = R.find(isNotNil)(result);

    return firstNonNilResult || path;
};

export const findPathToDeepestStepWithState = (appState, buildId, stepId, stepStateToFind) => {

    const allSteps = Utils.flatSteps(R.path(["buildDetails", buildId], appState));

    const step = filterStepsById(stepId)(allSteps)[0];

    const interestingStep = traverseChildren(stepStateToFind, [], step);

    if (R.isNil(interestingStep)) {
        return null;
    }

    return interestingStep;
};

export const findPathToDeepestFailureStep = (appState, buildId, stepId) => {
    return findPathToDeepestStepWithState(appState, buildId, stepId, "failure");
};

export const findPathToDeepestRunningStep = (appState, buildId, stepId) => {
    return findPathToDeepestStepWithState(appState, buildId, stepId, "running");
};