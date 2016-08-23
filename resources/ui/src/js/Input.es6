import React from 'react'
import Websocket from 'react-websocket'

class Input extends React.Component {

  handleData(data) {
    console.log("Received Message!");
  }

  render() {
      return <div>Waiting for input
        <Websocket url='ws://localhost:4444'
                      onMessage={this.handleData.bind(this)}/>
      </div>
  }
}

export default Input;
