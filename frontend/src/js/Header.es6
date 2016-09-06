import React from 'react';
import logo from '../img/logo.png';
import '../sass/header.sass';

export const Header = props => {
return <div className="appHeader">
    <div className="logo">
      <img src={logo} className="logoImage" alt="logo" />
      <span className="logoText">LAMBDA CD</span>
    </div>
    <span className="pipelineName">simple-pipeline</span>
    <button className="runButton">Start Build</button>
</div>
}
