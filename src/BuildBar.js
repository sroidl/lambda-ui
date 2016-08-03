import React, { Component } from 'react';
import './BuildBar.css';
import classNames from 'classnames';

class BuildBar extends Component {
  render() {
    let classes = classNames("buildSummary", this.props.state);

    let buildIcon = this.getBuildIcon(this.props.state);

    return (
      <div className={classes}>
        <span className="buildIcon">{buildIcon}</span>
        <span className="buildNumber">
          #{this.props.buildNumber}: {this.props.state}
        </span>
        <span className="startTime">Started: an hour ago</span>
        <span className="duration">Duration: 5min 46sec</span>
      </div>
    );
  }

  getBuildIcon(state) {
    switch(state) {
      case "success":
        return <i className='fa fa-check' aria-hidden='true'></i>;
      case "inProgress":
        return <i className='fa fa-cog' aria-hidden='true'></i>;
      case "error":
      default:
        return <i className='fa fa-exclamation' aria-hidden='true'></i>;


    }

  }
}

export default BuildBar;
