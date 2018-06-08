import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      latestMessage: {},
      members: [],
      zipcode: '',
    };
    this.roomID = this.props.match.params.roomID;

    this.socket = io.connect(process.env.PORT);
    this.socket.on('chat', data => {
      if (data.roomID === this.roomID) {
        console.log('Received message', data.message);
        this.setState({
          latestMessage: data.message,
        });
      }
    });
  }

  // Send post request to server to fetch room info when user visits link
  componentDidMount() {
    $.post('/api/roomInfo', { roomID: this.roomID }).then(roomMembers => {
      console.log('GOT ROOM MEMEBRS', roomMembers);
      this.setState({
        members: roomMembers,
        zipcode: roomMembers[0].zipcode,
      });
    });
  }

  sendMessage() {
    this.socket.emit('chat', {
      message: {
        name: this.state.name,
        message: this.state.message,
      },
      roomID: this.roomID,
    });
  }

  updateName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  updateMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    return (
      <div>
        Welcome to room {this.roomID}
        {/* <div className="is-divider" /> */}
        <div className="columns">
          <div id="yelp-list" className="column">
            <h3>Local Resturants</h3>
          </div>
          <div id="current-resturant" className="column">
            <h3>Current Selection</h3>
          </div>
          <div id="chat" className="column">
            <div>
              {/* Need to figure out how we're going to display room members and zipcode */}
              Members: {this.state.members.map(user => <span>{user.email} </span>)}
            </div>
            <div>Zipcode: {this.state.zipcode}</div>
            <h3>Name</h3>
            {/* This input field is just temporary. Ideally the name will be obtained from login*/}
            <div>
              <input type="text" value={this.state.name} onChange={this.updateName.bind(this)} />
            </div>
            <h3>Message</h3>
            <div>
              <input
                type="text"
                value={this.state.message}
                onChange={this.updateMessage.bind(this)}
              />
            </div>
            <button onClick={this.sendMessage.bind(this)}>Send</button>
            {/* This is temporary and just for testing. Ideally the messages will be stored in the database */}
            <h3>Latest Message</h3>
            <strong>{this.state.latestMessage.name} </strong> {this.state.latestMessage.message}
          </div>
        </div>
      </div>
    );
  }
}
export default Room;
