export const consoleThrowingBefore = (realConsole) => {
    const consoleThrowing = {
        error: (...args) => {
            realConsole.error("Got errors on console: ", args);
            throw new Error(args);
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