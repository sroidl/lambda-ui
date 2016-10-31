export const ADD_SUMMARIES = "addBuildSummaries";

export const addBuildSummary = (summary) => {
    return {type: ADD_SUMMARIES, summaries: summary};
};