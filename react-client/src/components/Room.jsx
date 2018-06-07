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
    this.roomID = this.props.match.params.roomID;

    this.socket = io.connect(process.env.PORT);
    this.socket.on('chat', (data) => {
      if (data.roomID === this.roomID) {
        console.log('Received message', data.message);
        this.setState({
          latestMessage: data.message,
        });
      }
    });
  }

//TO DO: Get room information from the database

  sendMessage() {
    this.socket.emit('chat', {
      message: {
        name: this.state.name,
        message: this.state.message,
      },
      roomID: this.roomID,
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
          Welcome to room {this.roomID}    
          {/* TO DO: Render room information to the page */}
          <h3>Name</h3>
          {/* This input field is just temporary. Ideally the name will be obtained from login*/}
          <div><input type="text"
                value={this.state.name}
                onChange={this.updateName.bind(this)}></input></div>
          <h3>Message</h3>
          <div><input type="text"  
                      value={this.state.message}
                      onChange={this.updateMessage.bind(this)}></input></div>
          <button onClick={this.sendMessage.bind(this)}>Send</button>
          {/* This is temporary and just for testing. Ideally the messages will be stored in the database */}
          <h3>Latest Message</h3> 
           <strong>{ this.state.latestMessage.name } </strong> {this.state.latestMessage.message}
      </div>
      )
  } 
}
export default Room;