import R from "ramda";
import {getFlatTree} from "FunctionalUtils.es6";

const getBuildDetails = R.view(R.lensProp("buildDetails"));
const getBuild = (buildId) => R.view(R.lensIndex(buildId));
const getBuildProps = buildId => R.pipe(getBuildDetails(), getBuild(buildId));

export const getFlatSteps = (state, buildId) => {
    const build = getBuildProps(buildId)(state);
    return getFlatTree(build, "steps");
};

const filterStepsById = stepId => R.filter(step => step.stepId === stepId);
const getFailedStep = R.filter(step => step.state === "failure");
const findAndFilterFailedStep = stepId => R.pipe(filterStepsById(stepId), getFailedStep());
const getSubSteps = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("steps")));
const getParentStep = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("parentId")));

export const findParentOfFailedSubstep = (state, buildId, stepId) => {
    if(!state.buildDetails){
        return null;
    }
    const flatSteps = getFlatSteps(state, buildId);
    let foundSteps = findAndFilterFailedStep(stepId)(flatSteps);
    if(!foundSteps || foundSteps.length < 1){
        return null;
    }

    // TODO: Use Steps from flatSteps
    const getHeadSteps = buildId => R.pipe(getBuildProps(buildId), R.view(R.lensProp("steps")));
    const steps = getHeadSteps(buildId)(state);
    foundSteps = getFailedStep(steps);
    if (!foundSteps || foundSteps.length < 1){
        return null;
    }

    let subSteps = getSubSteps(foundSteps);
    while (subSteps.length > 0){
        foundSteps = getFailedStep(subSteps);
        subSteps = getSubSteps(foundSteps) || [];
    }
    return getParentStep(foundSteps);
};



