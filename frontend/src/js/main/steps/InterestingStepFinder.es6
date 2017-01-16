import R from "ramda";
import * as Utils   from "../Utils.es6";

export const shouldShowInterestingStep = (state, buildId) => {
    if (!state.viewBuildSteps) {
        return false;
    }
    return state.viewBuildSteps[buildId] === "__showInterestingStep";
};

const findStepById = stepId => R.find(step => step.stepId === stepId);

const isNotNil = x => !R.isNil(x);

const traverseChildren = (state, path, step) => {

    if (step.state !== state) {
        return null;
    }

    const newPath = R.append(step.stepId, path);
    const curriedFindDeepest = R.curry(traverseChildren)(state, newPath);
    const result = R.map(curriedFindDeepest)(step.steps || []);
    const firstNonNilResult = R.find(isNotNil)(result);

    return firstNonNilResult || path;
};

export const findPathToDeepestStepWithState = (appState, buildId, stepId, stepStateToFind) => {
    const allSteps = Utils.flatSteps(R.path(["buildDetails", buildId], appState));
    const step = stepId === "root" ? R.path(["buildDetails", buildId], appState) : findStepById(stepId)(allSteps);
    const initialPath = R.isNil(step.stepId) ? [] : [step.stepId];
    const traverse = R.curry(traverseChildren)(stepStateToFind, initialPath);
    const interestingStep = R.find(x => !R.isNil(x))(R.map(traverse, step.steps));

    if (R.isNil(interestingStep)) {
        return null;
    }

    return {[stepStateToFind] : interestingStep};
};

/* eslint-disable */

export const findPathToMostInterestingStep = (appState, buildId, stepId) => {
    const priorities = ["waiting", "running", "failure"];
    const pathToDeepestStep = R.curry(findPathToDeepestStepWithState)(appState, buildId, stepId);
    const prioritizedFindings = R.map(pathToDeepestStep)(priorities);

    return R.find(isNotNil)(prioritizedFindings);
};