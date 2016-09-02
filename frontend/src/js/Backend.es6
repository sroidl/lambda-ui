import React from 'react';
import 'whatwg-fetch';
import {addBuildSummary} from './Actions.es6'

const receiveBuildSummaries = (dispatch) => {
  const endpoint = "ws://localhost:4444/api/summaries";

  let dummy = [
     { buildId: 1, buildNumber: 1, state: "success", startTime: "2016-08-29T14:54Z", duration: 360},
     { buildId: 2, buildNumber: 2, state: "failed",  startTime: "2016-08-29T13:54Z", duration: 120},
     { buildId: 4, buildNumber: 4, state: "running", startTime: "2016-08-31T12:54Z", duration: 5466}
  ]

  fetch(endpoint).then(response => response.json()).then(body=>dispatch(addBuildSummary(body.summaries)));



}

export { receiveBuildSummaries };
