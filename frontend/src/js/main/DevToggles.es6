import App from "./App.es6";
import R from "ramda";

const isActive = (toggleName) => {
    return R.pathOr(false, ["developmentToggles", toggleName])(App.appStore().getState());
};

class DevToggles {
    get usePolling() {
        return isActive("usePolling");
    }

    get showConnectionState() {
        return isActive("showConnectionState");
    }

    get showPipelineTour() {
        return isActive("showPipelineTour");
    }

    get quickDetails_expandCollapse() {
        return isActive("quickDetails_expandCollapse");
    }
}

export default new DevToggles();
