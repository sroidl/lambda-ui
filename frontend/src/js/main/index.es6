import LambdaUI from "./App.es6";
import "../../sass/main.sass";
import "../../thirdparty/skeleton.css";
import "../../thirdparty/normalize.css";

const config = window.lambdaui.config;
/* eslint-disable */
console.log("Using configuration", config);
LambdaUI.startUp(config);
