import React, { Component } from 'react';
import './BuildBar.css';

class BuildBar extends Component {
  render() {
    return (
      <div className="buildSummary">
        <div className="buildNumber">
          #{this.props.buildNumber}: {this.props.state}
        </div>
      </div>
    );
  }
}

export default BuildBar;
