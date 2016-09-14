import React, {PropTypes} from "react";

export const BuildDetailBreadcrumb = ({steps}) => {
  if (!steps || steps.length === 0) {
    return <span>&gt;</span>;
  }

  return null;
};

BuildDetailBreadcrumb.propTypes = {
  steps: PropTypes.array.isRequired,
  buildId: PropTypes.string.isRequired
};
