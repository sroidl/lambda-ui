import React from 'react';
import 'whatwg-fetch'

const receiveBuildSummaries = (dispatch) => {
  const endpoint = "http://localhost:4444/summaries";
  fetch(endpoint).then(() => {}).then((body)=>
      dispatch({type: "addBuildSummary", summaries: body.summaries})
  );
}

export default receiveBuildSummaries;
