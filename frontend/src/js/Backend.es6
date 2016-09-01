import React from 'react';
import 'whatwg-fetch';
import {addBuildSummary} from './Actions.es6'

const receiveBuildSummaries = (dispatch) => {
  const endpoint = "/api/summaries";

  let dummy = [
     { buildId: 1, state: "success", buildNumber: 1, startTime: "1:12", duration: "2 minutes" },
     { buildId: 2, buildNumber: 2, state: "failed", duration: "3 min", startTime: "today" },
     { buildId: 4, buildNumber: 4, state: "running", duration: "4min", startTime: "yesterday"}
  ]

  fetch(endpoint).then(() => {})
    .then(body=>dispatch(addBuildSummary(body.summaries)))
    .catch(()=>dispatch(addBuildSummary(dummy)));



}

export { receiveBuildSummaries };
