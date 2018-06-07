import React from 'react';
import io from 'socket.io-client';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      latestMessage: {},
    }
    this.socket = io.connect(`${process.env.DOMAIN || 'http://localhost'}:${process.env.PORT || 3000}`);
    this.socket.on('chat', (message) => {
      console.log('Received message', message);
      this.setState({
        latestMessage: message,
      });
    });
  }

//TO DO: Get room information from the database

  sendMessage() {
    this.socket.emit('chat', {
      name: this.state.name,
      message: this.state.message,
    });
  }

  updateName(e){
    this.setState({
      name: e.target.value,
    });
  }

  updateMessage(e){
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    return (
      <div>
          Welcome to room {this.props.match.params.roomID}    
          {/* TO DO: Render room information to the page */}
          <h3>Name</h3>
          <div><input type="text"
                value={this.state.name}
                onChange={this.updateName.bind(this)}></input></div>
          <h3>Message</h3>
          <div><input type="text"  
                      value={this.state.message}
                      onChange={this.updateMessage.bind(this)}></input></div>
          <button onClick={this.sendMessage.bind(this)}>Send</button>
          <h3>Latest Message</h3> 
           <strong>{ this.state.latestMessage.name } </strong> {this.state.latestMessage.message}
      </div>
      )
  } 
}
export default Room;