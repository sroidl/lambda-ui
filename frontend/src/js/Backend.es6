import React from 'react';
import 'whatwg-fetch';
import {addBuildSummary, addBuildDetails} from './Actions.es6';

export const receiveBuildSummaries = (dispatch) => {
  let endpoint = "http://localhost:4444/api/summaries";

  let dummySummaries = [
     { buildId: 1, buildNumber: 1, state: "success", startTime: "2016-08-29T14:54Z", duration: 360},
     { buildId: 2, buildNumber: 2, state: "failed",  startTime: "2016-08-29T13:54Z", duration: 120},
     { buildId: 4, buildNumber: 4, state: "running", startTime: "2016-08-31T12:54Z", duration: 5466},
     { buildId: 5, buildNumber: 4, state: "running", startTime: "2016-08-31T12:54Z", duration: -2}
  ];

  fetch(endpoint).then(response => response.json()).then(body=>dispatch(addBuildSummary(body.summaries)))
  .catch(()=>{
    console.log("fallback to dummy data");
    dispatch(addBuildSummary(dummySummaries));
  });
};

export const requestBuildDetails = (dispatch, buildId) => {
  let dummyBuildDetails = {
    1: {
      buildId: 1,
      commit: "git commit hash 1",
      steps: [
      {
        stepId: 1,
        name: "build",
        state: "success",
        startTime: "2016-08-29T14:54Z",
        endTime: "2016-08-29T15:04Z",
        steps: [
          {
            stepId: "1.1",
            name: "compile-to-jar",
            state: "success",
            starTime: "2016-08-29T14:54Z",
            endTime: "2016-08-29T15:02Z"
          },
          {
            stepId: "1.2",
            name: "test",
            state: "success",
            startTime: "2016-08-29T15:02Z",
            endTime: "2016-08-29T15:04Z"
          }
        ]
      },
      {
        stepId: 2,
        name: "deploy-to-dev",
        state: "failed",
        startTime: "2016-08-29T15:04Z",
        endTime: "2016-08-29T15:04Z"
      }
    ]}
  };

  let endpoint = "/api/details/" + buildId;
  fetch(endpoint).then(response => response.json()).then(body=>dispatch(addBuildDetails(body.details)))
  .catch(()=>{
    console.log("fallback to dummy details");
    dispatch(addBuildDetails(dummyBuildDetails[buildId]));
  });
};

export default {receiveBuildSummaries, requestBuildDetails};
