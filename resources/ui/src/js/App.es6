import appState from './AppState.es6'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import React from 'react';
import BuildSummaryList from './BuildSummaryList.es6'
import 'whatwg-fetch'



class LambdaUI {
  dispatchSummaries(body) {
    appState.dispatch({type:"addBuildSummary", summaries: body.summaries});
  }

  startUp() {


    fetch("http://localhost:4444/summaries", {"Access-Control-Allow-Origin" : "*" })

      .then(response => response.json()).then(body => this.dispatchSummaries(body));



    let rootElement = document.getElementById('entryPoint');
    ReactDOM.render(<Provider store={appState}>
                      <div>
                      <BuildSummaryList/>
                      </div>
                    </Provider>, rootElement);
  }
}

export default LambdaUI;
