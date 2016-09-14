import "whatwg-fetch";
import {addBuildSummary, addBuildDetails} from "./Actions.es6";

export const receiveBuildSummaries = (dispatch) => {
  const endpoint = "http://localhost:4444/api/summaries";

  const dummySummaries = [
     { buildId: 1, buildNumber: 1, state: "success", startTime: "2016-08-29T14:54Z", duration: 360},
     { buildId: 2, buildNumber: 2, state: "failed",  startTime: "2016-08-29T13:54Z", duration: 120},
     { buildId: 4, buildNumber: 4, state: "running", startTime: "2016-08-31T12:54Z", duration: 5466},
     { buildId: 5, buildNumber: 4, state: "running", startTime: "2016-08-31T12:54Z", duration: -2}
  ];

  fetch(endpoint)
    .then(response => response.json())
    .then(body => dispatch(addBuildSummary(body.summaries)))
    .catch(() => {
      dispatch(addBuildSummary(dummySummaries));
    });
};

export const requestBuildDetails = (dispatch, buildId) => {
  const dummyBuildDetails = {
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
            endTime: "2016-08-29T15:04Z",
            steps: [
              {
                stepId: "1.2.1",
                name: "test-unit",
                state: "success",
                startTime: "2016-08-29T15:02Z",
                endTime: "2016-08-29T15:04Z"
              },

              {
                stepId: "1.2.2",
                name: "test-integration",
                state: "success",
                startTime: "2016-08-29T15:02Z",
                endTime: "2016-08-29T15:04Z"
              },

              {
                stepId: "1.2.3",
                name: "test-acceptance",
                state: "failed",
                startTime: "2016-08-29T15:02Z",
                endTime: "2016-08-29T15:04Z"
              }
            ]

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

  const endpoint = "/api/details/" + buildId;
  fetch(endpoint)
    .then(response => response.json())
    .then(body => dispatch(addBuildDetails(body.details)))
    .catch(() => {
      dispatch(addBuildDetails(dummyBuildDetails[buildId]));
    });
};

export default {receiveBuildSummaries, requestBuildDetails};
