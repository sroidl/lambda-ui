import React, {PropTypes} from "react";
import {connect} from "react-redux";
import App from "App.es6";
import logo from "../../img/logo.png";
import "../../sass/header.sass";

export const HeaderLinks = (links) => {
    const linkComponent = (link) => {
        return <a href={link.url}>{link.name}</a>;
    };

    const linkComponents = links.map((link) => {
        return linkComponent(link);
    });
    if (links.length > 0) {
        return links.length === 1 ?
            <div>{linkComponent(links[0])}</div> :
            <div>{linkComponents}</div>;
    }
    return <div></div>;
};

export const Header = ({pipelineName}) => {

    const triggerNewFn = () => App.backend().triggerNewBuild();

    return <div className="appHeader">
        <div className="logo">
            <img src={logo} className="logoImage" alt="logo"/>
            <span className="logoText">LAMBDA CD</span>
        </div>
        <span className="pipelineName">{pipelineName}</span>
        <button className="runButton" onClick={triggerNewFn}>Start Build</button>
    </div>;
};

Header.propTypes = {
    pipelineName: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    return {
        pipelineName: state.config.name
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
