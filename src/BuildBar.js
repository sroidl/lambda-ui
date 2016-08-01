import React, { Component } from 'react';
import './BuildBar.css';
import classNames from 'classnames';

class BuildBar extends Component {
  render() {
    let classes = classNames("buildSummary", this.props.state);

    return (
      <div className={classes}>
        <span className="buildIcon">?</span>
        <span className="buildNumber">
          #{this.props.buildNumber}: {this.props.state}
        </span>
        <span className="startTime">Started: an hour ago</span>
        <span className="duration">Duration: 5min 46sec</span>
      </div>
    );
  }
}

export default BuildBar;
