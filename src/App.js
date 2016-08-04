import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import BuildList from './BuildList';

class App extends Component {
  render() {

    var data = [
      {id: 4, state: "inProgress"},
      {id: 3, state: "success"},
      {id: 2, state: "success"},
      {id: 1, state: "failure"}
    ];

    return (
      <div className="app">
        <div className="appHeader">
          <div className="logo">
            <img src={logo} className="logoImage" alt="logo" />
            <span className="logoText">LAMBDA CD</span>
          </div>
          <span className="pipelineName">p13n-reco</span>
          <button className="runButton">Start Build</button>
        </div>
        <div>
          <BuildList data={data} />
        </div>
      </div>
    );
  }
}

export default App;
