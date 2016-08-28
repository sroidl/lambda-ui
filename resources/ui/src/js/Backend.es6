import React from 'react';
import 'whatwg-fetch';
import {addBuildSummary} from './Actions.es6'

const receiveBuildSummaries = (dispatch) => {
  const endpoint = "http://localhost:4444/summaries";

  fetch(endpoint).then(() => {})
    .then(body=>dispatch(addBuildSummary(body.summaries)));



}

export { receiveBuildSummaries };
