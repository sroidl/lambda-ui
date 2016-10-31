export const HIDE_BUILD_OUTPUT = "hideBuildOutput";
export const ADD_BUILDSTEP_OUTPUT = "addBuildstepOutput";
export const OUTPUT_CONNECTION_STATE = "outputConnectionState";

export const hideBuildOutput = () => {
    return {type: HIDE_BUILD_OUTPUT};
};

export const addBuildstepOutput = (buildId, stepId, output) => {
    return {type: ADD_BUILDSTEP_OUTPUT, buildId: buildId, stepId: stepId, output: output};
};

export const outputConnectionState = (connectionState) => {
    return {type: OUTPUT_CONNECTION_STATE, state: connectionState};
};

