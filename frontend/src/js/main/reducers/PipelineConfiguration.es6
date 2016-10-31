import {ADD_CONFIGURATION} from "actions/ConfigActions.es6";

export const PipelineConfigurationReducer = (oldState = {}, action) => {
    switch (action.type) {
        case ADD_CONFIGURATION:
            return Object.assign({}, action.config);
        default:
            return oldState;
    }
};
