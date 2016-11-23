import R from "ramda";

const SUCCESS_FAVICON_LINK = "http://www.favicon-generator.de/images/icons/51c78d75-bc6a-4455-a0ee-fc38a391c1f8-16.ico";
const FAILURE_FAVICON_LINK = "http://www.favicon-generator.de/images/icons/9a623dd8-e617-4f97-b315-6cdbc16780f8-16.ico";
const RUNNING_FAVICON_LINK = "http://www.favicon-generator.de/images/icons/de3c2446-91a0-40f5-9576-1de331190356-16.ico";
const WAITING_FAVICON_LINK = "http://www.favicon-generator.de/images/icons/03305978-ad7f-495b-a1fc-1293bcf1f27d-16.ico";
const KILLED_FAVICON_LINK = "";

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