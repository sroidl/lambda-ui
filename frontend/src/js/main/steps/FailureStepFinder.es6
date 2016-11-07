import R from "ramda";

const getBuildDetails = R.view(R.lensProp("buildDetails"));
const getBuild = (buildId) => R.view(R.lensIndex(buildId));
const getSteps = R.view(R.lensProp("steps"));
const getHeadSteps = buildId => R.pipe(getBuildDetails(), getBuild(buildId), getSteps());

const filterStepsById = stepId => R.filter((step) => step.stepId === stepId);

const getFailedStep = R.filter(step => step.state === "failure");
const getSubSteps = R.pipe(R.view(R.lensIndex(0)), R.view(R.lensProp("steps")));

export const getFlatSteps = (state, buildId) => {
    const steps = getHeadSteps(buildId)(state);
    let flatSteps = [];
    const extractElements = (steps, flatSteps) => {
        for (let i = 0; i < steps.length; i++){
            const newElement = {
                stepId: steps[i].stepId,
                state: steps[i].state,
                parentId: steps[i].parentId
            };
            flatSteps.push(newElement);
            if(steps[i].steps instanceof Array && steps[i].steps.length > 0){
                extractElements(steps[i].steps, flatSteps);
            }
        }
    };
    extractElements(steps,flatSteps);
    return flatSteps;
};


export const findParentOfFailedSubstep = (state, buildId, stepId) => {
    if(!state.buildDetails){
        return null;
    }
    const flatSteps = getFlatSteps(state, buildId);
    const step = filterStepsById(stepId)(flatSteps)[0];
    if(step.state !== "failure"){
        return null;
    }

    const steps = getHeadSteps(buildId)(state);
    let foundStep = getFailedStep(steps);
    if (!foundStep || foundStep.length < 1){
        return null;
    }
    let subSteps = getSubSteps(foundStep);
    while (subSteps.length > 0){
        foundStep = getFailedStep(subSteps);
        subSteps = getSubSteps(foundStep) || [];
    }
    return foundStep[0].parentId;
};


