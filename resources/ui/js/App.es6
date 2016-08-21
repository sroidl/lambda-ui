import appState from './AppState.js'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import React from 'react';
import BuildSummaryList from './BuildSummaryList.js'


class LambdaUI {

  startUp() {
    let rootElement = document.getElementById('entryPoint');
    ReactDOM.render(<Provider store={appState}>
                      <BuildSummaryList/>
                    </Provider>, rootElement);

  }
}

export default LambdaUI;
