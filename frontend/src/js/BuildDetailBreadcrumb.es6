import React, {PropTypes} from "react";
import "../sass/buildDetails.sass";

export const BuildDetailBreadcrumb = ({steps}) => {
  if (!steps || steps.length === 0) {
    return <div className="buildDetailBreadcrumb">&gt;</div>;
  }

  return null;
};

BuildDetailBreadcrumb.propTypes = {
  steps: PropTypes.array,
  buildId: PropTypes.number.isRequired
};
