import React, {PropTypes} from "react";
import {connect} from "react-redux";
import App from "./App.es6";
import logo from "../../img/logo.png";
import "../../sass/header.sass";
import R from "ramda";
import {startTutorial} from "./tutorial/Tutorial.es6";
import DevToggles from "./DevToggles.es6";

export const HeaderLinks = (props) => {
    if(!props) {
        return null;
    }
    const {links} = props;
    if(!links || links.length < 1){
        return null;
    }

    const defaultTarget = R.defaultTo("_blank");

    const linkComponent = (link, key) => {
        return <a className="link" target={defaultTarget(link.target)} key={key} href={link.url}>{link.text}</a>;
    };

    const mapIndexed = R.addIndex(R.map);

    const linkComponents = mapIndexed((link, idx) => linkComponent(link, "headerlink-" + idx))(links);

    return <div className="linksHeader">{linkComponents}</div>;
};

HeaderLinks.propTypes = {
    links: PropTypes.array
};

const startBuildButton = (showStartBuildButton, triggerNewFn) => {
    if(showStartBuildButton) {
        return <button className="runButton" onClick={triggerNewFn}>Start Build</button>;
    }
    return null;
};

export const Header = ({pipelineName, links, showStartBuildButton}) => {
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
                <img src={logo} className="logoImage" alt="logo"/>
                <span className="logoText">{pipelineName}</span>
        </div>
        {headerLinks}
        {startBuildButton(showStartBuildButton, triggerNewFn)}
        {pipelineTour}
    </div>;
};


Header.propTypes = {
    pipelineName: PropTypes.string.isRequired,
    showStartBuildButton: PropTypes.bool.isRequired,
    links: PropTypes.array
};

export const mapStateToProps = (state) => {
    const headerLinks = R.pathOr([], ["config", "navbar", "links"])(state);
    return {
        pipelineName: state.config.name,
        links: headerLinks,
        showStartBuildButton: R.pathOr(true, ["config", "showStartBuildButton"])(state)
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return ownProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
