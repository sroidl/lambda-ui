export const ADD_CONFIGURATION = "addConfiguration";

export const addConfiguration = config => {
    return {type: ADD_CONFIGURATION, config: config};
};