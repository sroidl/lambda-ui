import R from "ramda";

const getBuildDetails = R.view(R.lensProp("buildDetails"));
const getBuild = (buildId) => R.view(R.lensIndex(buildId));
const getSteps = R.view(R.lensProp("steps"));
const getHeadSteps = buildId => R.pipe(getBuildDetails(), getBuild(buildId), getSteps());

export const getFlatSteps = (state, buildId) => {
    const steps = getHeadSteps(buildId)(state);

    const flatSteps = [];

    const extractElements = (steps, flatSteps) => {
        R.map(step => {flatSteps.push(step);
            if(step.steps instanceof Array && step.steps.length > 0){
                extractElements(step.steps, flatSteps);
            }
        })(steps);
    };

    extractElements(steps,flatSteps);
    return flatSteps;
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



