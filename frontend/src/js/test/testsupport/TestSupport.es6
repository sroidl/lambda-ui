export const MockStore = (state, dispatch = () => {
}) => {
    return {
        getState: () => state,
        dispatch: dispatch,
        subscribe: () => {
        }
    };
};
