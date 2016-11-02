import React, {PropTypes} from "react";
import {connect} from "react-redux";
import App from "App.es6";
import logo from "../../img/logo.png";
import "../../sass/header.sass";

export const HeaderLinks = ({links}) => {
    if(!links || links.length < 1){
        return null;
    }
    const linkComponent = (link) => {
        return <a target="_blank" key={link.url} href={link.url}>{link.text}</a>;
    };

    const linkComponents = links.map((link) => {
        return linkComponent(link);
    });

    if (links.length === 1){
        return <div className="linksHeader">{linkComponent(links[0])}</div>;
    }
    return <div className="linksHeader">{linkComponents}</div>;
};

HeaderLinks.propTypes = {
    links: PropTypes.array
};

export const Header = ({pipelineName, links}) => {
    const triggerNewFn = () => App.backend().triggerNewBuild();

    return <div className="appHeader">
        <div className="logo">
            <img src={logo} className="logoImage" alt="logo"/>
            <span className="logoText">LAMBDA CD</span>
        </div>
        <span className="pipelineName">{pipelineName}</span>

        <HeaderLinks links={links} />
        <button className="runButton" onClick={triggerNewFn}>Start Build</button>
    </div>;
};


Header.propTypes = {
    pipelineName: PropTypes.string.isRequired,
    links: PropTypes.array
};

export const mapStateToProps = (state) => {
    const headerLinks = !state.config.navbar || !state.config.navbar.links
        ? [] : state.config.navbar.links;
    return {
        pipelineName: state.config.name,
        links: headerLinks
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
