import React from "react";

const SUCCESS_ICON = "fa-check";
const FAILURE_ICON = "fa-times";
const RUNNING_ICON = "fa-cog";
const KILLED_ICON = "fa-ban";
const DEFAULT_ICON = "fa-ellipsis-h";

export const StateIcon = (state) => {
    let iconClass;
    let hintText = "";
    switch (state) {
        case "success":
            iconClass = SUCCESS_ICON;
            hintText = "Success";
            break;
        case "failure":
            iconClass = FAILURE_ICON;
            hintText = "Failure";
            break;
        case "running":
            iconClass = RUNNING_ICON;
            hintText = "Running";
            break;
        case "killed":
            iconClass = KILLED_ICON;
            hintText = "Killed";
            break;
        default:
            iconClass = DEFAULT_ICON;
    }
    return <div title={hintText} className="buildIcon"><i className={"fa " + iconClass}/></div>;
};