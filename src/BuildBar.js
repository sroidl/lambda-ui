import React, { Component } from 'react';
import './BuildBar.css';
import classNames from 'classnames';

class BuildBar extends Component {

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
    let classes = classNames("row", "buildSummary", this.props.state, {"open" : this.state.open});

    let buildIcon = this.getBuildIcon(this.props.state);

    return (
      <div className={classes} onClick={this.toggleBar}>
        <span className="one column buildIcon">{buildIcon}</span>
        <span className="two columns buildNumber">
          #{this.props.buildNumber}
        </span>
        <span className="three columns startTime">Started: an hour ago</span>
        <span className="three columns duration">Duration: 5min 46sec</span>
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
