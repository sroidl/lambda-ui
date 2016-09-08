import appState from './AppState.es6'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import React from 'react';
import BuildSummaryList from './BuildSummaryList.es6'
import Header from './Header.es6'
import * as backend from './Backend.es6'


class LambdaUI {
  startUp() {

    backend.receiveBuildSummaries(appState.dispatch);

    let rootElement = document.getElementById('entryPoint');
    ReactDOM.render(<Provider store={appState}>
                      <div>
                      <Header />
                      <BuildSummaryList/>
                      </div>
                    </Provider>, rootElement);
  }
}

export default LambdaUI;
