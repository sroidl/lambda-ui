import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import logo from '../img/logo.png';
import '../sass/header.sass';

export const Header = ({pipelineName}) => {

return <div className="appHeader">
          <div className="logo">
            <img src={logo} className="logoImage" alt="logo" />
            <span className="logoText">LAMBDA CD</span>
          </div>
          <span className="pipelineName">{pipelineName}</span>
          <button className="runButton">Start Build</button>
        </div>;
};

Header.propTypes = {
  pipelineName: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
      pipelineName: state.config.name
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return ownProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
