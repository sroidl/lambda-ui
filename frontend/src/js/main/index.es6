import LambdaUI from "./App.es6";
import "../../sass/main.sass";
import "../../thirdparty/skeleton.css";
import "../../thirdparty/normalize.css";
import Toggles from "./DevToggles.es6";

const updateTitle = (pipelineName) => {
    document.title = pipelineName;
};

const config = window.lambdaui.config;
updateTitle(config.name);


/* eslint-disable no-console */
console.log("Using configuration", config);
LambdaUI.startUp(config);

console.log("UsePolling ", Toggles.usePolling);
console.log("ShowInterestingStep ", Toggles.showInterestingStep);
console.log("ShowPipelineTour ", Toggles.showPipelineTour);
console.log("ShowConnectionState ", Toggles.showConnectionState);