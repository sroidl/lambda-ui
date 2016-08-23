import appState from './AppState.es6'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import React from 'react';
import BuildSummaryList from './BuildSummaryList.es6'
import Input from "./Input.es6"

class LambdaUI {
// <BuildSummaryList/>
  startUp() {
    let rootElement = document.getElementById('entryPoint');
    ReactDOM.render(<Provider store={appState}>
                      <BuildSummaryList/>
                    </Provider>, rootElement);
  }
}

export default LambdaUI;
