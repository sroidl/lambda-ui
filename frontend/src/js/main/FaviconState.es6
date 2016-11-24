import R from "ramda";
import successFavicon from "../../img/successFavicon.ico";
import failureFavicon from "../../img/failureFavicon.ico";
import runningFavicon from "../../img/runningFavicon.ico";
import waitingFavicon from "../../img/warningFavicon.ico";

const SUCCESS_FAVICON_LINK = successFavicon;
const FAILURE_FAVICON_LINK = failureFavicon;
const RUNNING_FAVICON_LINK = runningFavicon;
const WAITING_FAVICON_LINK = waitingFavicon;
const KILLED_FAVICON_LINK = "";
const DEFAULT_FAVICON_LINK = "";



export const changeFavicon = (src) => {
    const link = document.createElement("link");
    const oldLink = document.getElementById("dynamic-favicon");
    link.id = "dynamic-favicon";
    link.rel = "shortcut icon";
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
};

export const setStateFavicon = (state) => {

    switch(state){
        case "success":
            changeFavicon(SUCCESS_FAVICON_LINK);
            break;
        case "failed":
            changeFavicon(FAILURE_FAVICON_LINK);
            break;
        case "running":
            changeFavicon(RUNNING_FAVICON_LINK);
            break;
        case "waiting":
            changeFavicon(WAITING_FAVICON_LINK);
            break;
        case "killed":
            changeFavicon(KILLED_FAVICON_LINK);
            break;
        default:
            changeFavicon(DEFAULT_FAVICON_LINK);
            break;
    }
};

export const getStateForFavicon = summaries => {
    if(!summaries || R.isEmpty(summaries)){
        return null;
    }
    let state = null;

    R.map((build) => {state = build.state;})(summaries);

    return state;
};


