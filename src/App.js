import React, { Component } from 'react';
import logo from './logo.svg';
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
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>LambdaCD</h2>
        </div>
        <div className="App-intro">
          <BuildList data={data} />
        </div>
      </div>
    );
  }
}

export default App;
