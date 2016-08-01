import React, { Component } from 'react';
import './BuildBar.css';
import classNames from 'classnames';

class BuildBar extends Component {
  render() {
    let classes = classNames("buildSummary", this.props.state);

    return (
      <div className={classes}>
        <div className="buildNumber">
          #{this.props.buildNumber}: {this.props.state}
        </div>
      </div>
    );
  }
}

export default BuildBar;
