import App from "App.es6";
import R from "ramda";

const isActive = (toggleName) => {
    return R.pathOr(false, ["developmentToggles", toggleName]) (App.appStore().getState());
};

class DevToggles {
    get usePolling () {
        return isActive("usePolling");
    }
    get showInterestingStep () {
        return isActive("showInterestingStep");
    }
    get showConnectionState () {
        return isActive("showConnectionState");
    }
    get useAnsiCodeColors () {
        return isActive("useAnsiCodeColors");
    }
    get handleTriggerSteps() {
        return isActive("handleTriggerSteps");
    }
    get useNewPipelineStructure() {
        return isActive("useNewPipelineStructure");
    }
}

export default new DevToggles();