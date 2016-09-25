import {createLambdaUiStore as createStore} from "./AppState.es6";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import React from "react";
import BuildSummaryList from "./BuildSummaryList.es6";
import Header from "./Header.es6";
import BuildStepOutput from "./BuildStepOutput.es6";
// import * as backend from "./Backend.es6";
import {Backend} from "./BackendNew.es6";


let backend;
let appStore;

export class LambdaUI {

  appStore() {
    return appStore;
  }

  backend() {
    return backend;
  }

  startUp() {
    appStore = createStore();
    backend = new Backend("localhost:8081");

    // backend.receiveBuildSummaries(appState.dispatch);

    const rootElement = document.getElementById("entryPoint");
    ReactDOM.render(<Provider store={this.appStore()}>
                      <div>
                      <Header />
                      <BuildSummaryList/>
                      <BuildStepOutput/>
                      </div>
                    </Provider>, rootElement);
  }
}

export default new LambdaUI();
