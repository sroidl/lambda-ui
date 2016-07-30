import React, { Component } from 'react';
import BuildBar from './BuildBar';

class BuildList extends Component {
  render() {
    let builds = this.props.data.map((build) => {
      return (
        <BuildBar buildNumber={build.id} state={build.state} key={build.id} />
      );
    });

    return (
      <div className="builds">
        {builds}
      </div>
    );
  }
}

export default BuildList;
