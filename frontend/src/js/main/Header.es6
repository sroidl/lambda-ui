import React, {PropTypes} from "react";
import {connect} from "react-redux";
import App from "App.es6";
import logo from "../../img/logo.png";
import "../../sass/header.sass";

export const HeaderLinks = (links) => {
    const linkComponent = (link) => {
        return <a href={link.url}>{link.text}</a>;
    };

    const linkComponents = links.map((link) => {
        return linkComponent(link);
    });
    if (links.length > 0) {
        return links.length === 1 ?
            <div className="linksHeader">{linkComponent(links[0])}</div> :
            <div className="linksHeader">{linkComponents}</div>;
    }
    return <div></div>;
};

export const Header = ({pipelineName, links}) => {

    const triggerNewFn = () => App.backend().triggerNewBuild();

    return <div className="appHeader">
        <div className="logo">
            <img src={logo} className="logoImage" alt="logo"/>
            <span className="logoText">LAMBDA CD</span>
        </div>
        <span className="pipelineName">{pipelineName}</span>
        {HeaderLinks(links)}
        <button className="runButton" onClick={triggerNewFn}>Start Build</button>
    </div>;
};

Header.propTypes = {
    pipelineName: PropTypes.string.isRequired,
    links: PropTypes.array
};

export const mapStateToProps = (state) => {
    return {
        pipelineName: state.config.name,
        links: state.config.navbar.links
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
