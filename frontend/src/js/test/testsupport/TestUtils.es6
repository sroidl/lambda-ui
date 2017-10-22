export const consoleThrowingBefore = (realConsole) => {
    const consoleThrowing = {
        error: (...args) => {
            realConsole.error("Got errors on console: ", args);
            // throw new Error(args); // This breaks all tests where something (e.g. a third party library) logs to console.error; commenting for now
        },
        log: (...args) => {
            realConsole.log(args);
        }
    };
    realConsole = window.console;
    window.console = consoleThrowing;
};

export const consoleThrowingAfter = (realConsole) => {
    window.console = realConsole;
};

export const MockStore = (state, dispatch = () => {}) => {
    return {
        getState: () => state,
        dispatch: dispatch,
        subscribe: () => {}
    };
};
