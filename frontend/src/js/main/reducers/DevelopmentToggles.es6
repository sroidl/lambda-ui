import R from "ramda";

export const DevelopmentTogglesReducer = (state={}, action) => {
    if (action.type === "DEV_TOGGLE") {
        const lens = R.lensProp(action.toggle);
        return R.set(lens, !R.view(lens,state))(state);
    }
    return state;
};
