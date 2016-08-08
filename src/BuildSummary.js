import React, { Component } from 'react';
import './BuildSummary.css';
import classNames from 'classnames';
import BuildBar from './BuildBar';

class BuildSummary extends Component {

  constructor() {
    super();
    this.state = {
      open: false
    }

    this.toggleBar = this.toggleBar.bind(this);
  }

  toggleBar() {
    this.setState({open: !this.state.open});
  }

  render() {
    let classes = classNames(this.props.state, {"open" : this.state.open});

    return (
      <div className={classes} onClick={this.toggleBar}>
        <BuildBar buildNumber={this.props.buildNumber} state={this.props.state}/>

      </div>
    );
  }
}

export default BuildSummary;
