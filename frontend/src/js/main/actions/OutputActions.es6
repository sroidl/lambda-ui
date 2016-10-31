export const HIDE_BUILD_OUTPUT = "hideBuildOutput";
export const ADD_BUILDSTEP_OUTPUT = "addBuildstepOutput";

export const hideBuildOutput = () => {
    return {type: HIDE_BUILD_OUTPUT};
};

export const addBuildstepOutput = (buildId, stepId, output) => {
    return {type: ADD_BUILDSTEP_OUTPUT, buildId: buildId, stepId: stepId, output: output};
};

