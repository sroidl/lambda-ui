import LambdaUI from "./App.es6";
import "../../sass/main.sass";
import "../../thirdparty/skeleton.css";
import "../../thirdparty/normalize.css";

const config = window.lambdaui.config;
/* eslint-disable */
console.log("Configuration read: ", config);
LambdaUI.startUp(config);
