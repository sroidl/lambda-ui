import LambdaUI from "./App.es6";
import "../../sass/main.sass";
import "../../thirdparty/skeleton.css";
import "../../thirdparty/normalize.css";

const updateTitle = (pipelineName) => {
    document.title = pipelineName;
};

const config = window.lambdaui.config;
updateTitle(config.name);


/* eslint-disable no-console */
console.log("Using configuration", config);
LambdaUI.startUp(config);


