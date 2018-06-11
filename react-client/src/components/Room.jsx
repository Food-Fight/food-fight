import React from 'react';
import io from 'socket.io-client';
import $ from 'jquery';
import RestaurantList from './RestaurantList.jsx';
import CurrentSelection from './CurrentSelection.jsx';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      messages: [],
      members: [],
      zipcode: '75020', //hardcoding zip for testing
      currentSelection: undefined,
      isNominating: true,
    };
    this.roomID = this.props.match.params.roomID;

    this.nominateRestaurant = this.nominateRestaurant.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.voteApprove = this.voteApprove.bind(this);
    this.voteVeto = this.voteVeto.bind(this);

    this.socket = io.connect(process.env.PORT);
    this.socket.on('chat', (roomID) => {
      if (roomID === this.roomID) {
        console.log('Received message');
        this.getMessages();
      }
    });
  }

  // Send post request to server to fetch room info when user visits link
  componentDidMount() {
    this.getMessages();
    this.getRoomInfo();
  }

  getMessages() {
    $.post('/api/messageInfo', { roomID: this.roomID }).then(messages => {
      console.log('GOT MESSAGES', messages);
      this.setState({
        messages: messages,
      });
    });
  }

  getRoomInfo() {
    $.post('/api/roomInfo', { roomID: this.roomID }).then(roomMembers => {
      console.log('GOT ROOM MEMEBRS', roomMembers);
      this.setState({
        members: roomMembers,
        zipcode: roomMembers[0].zipcode,
      });
    });
  }

  nominateRestaurant(restaurant) {
    if (this.state.isNominating) {
      // TO DO: Record in databse that previous restaurant was vetoed
      this.setState({
        currentSelection: restaurant,
        isNominating: false,
      });
      // TO DO: Update database with current selection
    }
  }

  sendMessage() {
    let messageObj = {
      message: {
        name: this.state.name,
        message: this.state.message,
      },
      roomID: this.roomID,
    };
    $.post('/api/saveMessage', messageObj).then(() => {
      this.socket.emit('chat', messageObj);
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

  voteApprove() {
    /* TO DO: Check if a user has already voted for
    the given restaurant to prevent duplicate votes */

    //TO DO: Update vote number in the database
  }

  voteVeto() {
    this.setState({
      isNominating: true,
      currentSelection: undefined,
    });
  }

  render() {
    let currentSelection = this.state.currentSelection
      ? <CurrentSelection restaurant={this.state.currentSelection} />
      : <div>Please nominate a restaurant</div>
    return (
      <div>
        {/* <div className="is-divider" /> */}
        <div className="columns">
          <div id="yelp-list" className="column">
            <h3 className="is-size-3">Local Resturants</h3>
            <RestaurantList zipcode={this.state.zipcode} nominate={this.nominateRestaurant} />
          </div>
          <div id="current-resturant" className="column">
            <h3 className="is-size-3">Current Selection</h3>
            {currentSelection}
            <button onClick={this.voteApprove}>Approve</button>
            <button onClick={this.voteVeto}>Veto</button>
          </div>
          <div id="chat" className="column">
            <h3 className="is-size-3">Chat</h3>
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
              <input type="text" value={this.state.message} onChange={this.updateMessage.bind(this)} />
            </div>
            <button onClick={this.sendMessage.bind(this)}>Send</button>
            {/* This is temporary and just for testing. Ideally the messages will be stored in the database */}
            <h3>Messages</h3>
            {this.state.messages.map((message) => {
              <p><strong>{message.name} </strong> {message.message}</p>
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default Room;
