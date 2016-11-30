export const OPEN_TRIGGER_DIALOG = "openTriggerDialog";
export const CLOSE_TRIGGER_DIALOG = "closeTriggerDialog";

export const openTriggerDialog = (url, parameter, name) => {
    return {type: OPEN_TRIGGER_DIALOG, url: url, parameter: parameter, triggerName: name};
};

export const closeTriggerDialog = () => {
    return {type: CLOSE_TRIGGER_DIALOG};
};