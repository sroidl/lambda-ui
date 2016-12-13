import {ADD_BUILD_DETAILS} from "actions/BuildDetailActions.es6";

export const BuildDetailsReducer = (oldState = {}, action) => {
    switch (action.type) {
        case ADD_BUILD_DETAILS: {
            const newObj = {};
            newObj[action.buildId] = action.buildDetails;
            return Object.assign({}, oldState, newObj);
        }

        default:
            return oldState;
    }
};
