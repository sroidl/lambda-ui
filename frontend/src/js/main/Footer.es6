import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "../../sass/footer.sass";
import R from "ramda";

const Footer = ({lambdauiVersion, lambdacdVersion, showVersions}) => {
    if(!showVersions) {
        return null;
    }


    return <div>
        <div className="version-info">
            <div className="version-info__link"><a href="https://github.com/sroidl/lambda-ui" target="_blank">LambdaUI: {lambdauiVersion}</a></div>
            <div className="version-info__link"><a href="https://github.com/flosell/lambdacd" target="_blank">LambdaCD: {lambdacdVersion}</a></div>
        </div>
    </div>;

};


Footer.propTypes = {
    lambdauiVersion: PropTypes.string,
    lambdacdVersion: PropTypes.string,
    showVersions: PropTypes.bool
};

const mapStateToProps = (state) => {

    return {
        lambdauiVersion: R.path(["versions", "lambdauiVersion"])(state.config),
        lambdacdVersion: R.path(["versions", "lambdacdVersion"])(state.config),
        showVersions: true
    };
};

export default connect(mapStateToProps)(Footer);

