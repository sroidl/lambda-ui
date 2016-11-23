import R from "ramda";

const SUCCESS_FAVICON_LINK = "http://icons.veryicon.com/ico/System/Flatastic%202/success.ico";
const FAILURE_FAVICON_LINK = "http://www.iconsdb.com/icons/download/red/delete-2-16.ico";
const RUNNING_FAVICON_LINK = "http://www.iconarchive.com/download/i96210/iconsmind/outline/Gears.ico";
const WAITING_FAVICON_LINK = "http://www.iconarchive.com/download/i7929/hopstarter/soft-scraps/Button-Warning.ico";
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


