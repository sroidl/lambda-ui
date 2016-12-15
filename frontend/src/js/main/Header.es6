import React, {PropTypes} from "react";
import {connect} from "react-redux";
import App from "App.es6";
import logo from "../../img/logo.png";
import "../../sass/header.sass";
import R from "ramda";
import {startTutorial} from "tutorial/Tutorial.es6";
import DevToggles from "DevToggles.es6";

export const HeaderLinks = (props) => {
    if(!props) {
        return null;
    }
    const {links} = props;
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

    let headerLinks;
    if(links) {
        headerLinks = <HeaderLinks links={links} />;
    }
    else {
        headerLinks = "";
    }

    let pipelineTour = "";
    if(DevToggles.showPipelineTour){
        pipelineTour = <a href="#" onClick={startTutorial}>Take a tour through your pipeline</a>;
    }

    return <div className="appHeader">
        <div className="logo">
            <a href="http://www.lambda.cd/">
                <img src={logo} className="logoImage" alt="logo"/>
            </a>
            <span className="logoText">{pipelineName}</span>
        </div>
        {headerLinks}
        <button className="runButton" onClick={triggerNewFn}>Start Build</button>
        {pipelineTour}
    </div>;
};


Header.propTypes = {
    pipelineName: PropTypes.string.isRequired,
    links: PropTypes.array
};

export const mapStateToProps = (state) => {
    const headerLinks = R.view(R.lensPath(["config", "navbar", "links"]))(state) || [];
    return {
        pipelineName: state.config.name,
        links: headerLinks
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
