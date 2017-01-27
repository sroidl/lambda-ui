/* eslint-disable */
import React, {PropTypes} from "react";
import {connect} from "react-redux";
import * as R from "ramda";

const createLink = (detail, index) => {
    const subDetails = R.defaultTo(null, detail.details);
    const content = R.isNil(detail.href) ?
        <span className="buildStepLayer__detail-tab-label">{detail.label}</span> :
        <a className="buildStepLayer__detail-tab-link" href={detail.href}>{detail.label}</a>;

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


const mapStateToProps = (state, initialProps) => {
    const {buildId, stepId, rootLabel} = initialProps;


    return {details: []};
};

export default connect(mapStateToProps)(DetailTab)

