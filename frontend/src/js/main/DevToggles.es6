import App from "App.es6";
import R from "ramda";

const isActive = (toggleName) => {
    return R.pathOr(false, ["developmentToggles", toggleName])(App.appStore().getState());
};

class DevToggles {
    get usePolling() {
        return isActive("usePolling");
    }

    get showInterestingStep() {
        return isActive("showInterestingStep");
    }

    get showConnectionState() {
        return isActive("showConnectionState");
    }

    get handleTriggerSteps() {
        return isActive("handleTriggerSteps");
    }

    get showPipelineTour() {
        return isActive("showPipelineTour");
    }

    get quickDetails_expandCollapse() {
        return isActive("quickDetails_expandCollapse");
    }

    get showKillStep() {
        return isActive("showKillStep");
    }

    get showRetriggerStep() {
        return isActive("showRetriggerStep");
    }
}

export default new DevToggles();
