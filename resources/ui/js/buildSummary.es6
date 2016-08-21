import React, { Component } from 'react';
import { connect } from 'react-redux';

class BuildSummaryPresentation extends Component {
  render() {
    return <span>
            <h1>Hello World. Current Count is {this.props.currentCounter}</h1>
            <button onClick={this.props.buttonClick}> Increment</button>
           </span>
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentCounter: state.counterValue
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>  {
  return {
    buttonClick: () => {
      console.log("Clicked Button :) ");
      dispatch({type: "INCREASE"});
    }
  }
}

const BuildSummary = connect(
  mapStateToProps,
  mapDispatchToProps)(BuildSummaryPresentation);

export default BuildSummary;
