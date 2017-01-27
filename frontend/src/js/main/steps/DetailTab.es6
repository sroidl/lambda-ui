import React, {PropTypes} from "react";
import {connect} from "react-redux";
import R from "ramda";
import * as Utils from "../Utils.es6";

const createLink = (detail, index) => {
    const subDetails = R.defaultTo(null, detail.details);
    const content = R.isNil(detail.href) ?
        <span className="buildStepLayer__detail-tab-label">{detail.label}</span> :
        <a className="buildStepLayer__detail-tab-link" href={detail.href} target="_blank">{detail.label}</a>;

    return <li key={index}>
        {content}
        {subDetails && <DetailList details={subDetails}/>}
        </li>;
};

const mapIndexed = R.addIndex(R.map);

const DetailList = ({details}) => {
    return <ul>
        {mapIndexed(createLink, details)}
    </ul>;
};

DetailList.propTypes = {
    details: PropTypes.array.isRequired
};


export const DetailTab = ({details}) => {
    return <div className="detailTab">
      <DetailList details={details} />
    </div>;
};

DetailTab.propTypes = {
    details: PropTypes.array.isRequired
};


export const mapStateToProps = (state, initialProps) => {
    const {buildId, stepId, rootLabel} = initialProps;
    const buildDetails = R.propOr({}, buildId)(state.buildDetails);
    const flatSteps = Utils.flatSteps(buildDetails);
    const step = R.find((step) => step.stepId === stepId)(flatSteps);
    const allDetails = R.propOr([], "details")(step);
    const detailsForRootLabel = R.find((detail) => detail.label === rootLabel)(allDetails);

    return {details: R.propOr([], "details")(detailsForRootLabel)};
};

export default connect(mapStateToProps)(DetailTab);

