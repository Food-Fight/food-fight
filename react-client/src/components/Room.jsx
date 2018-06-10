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
      zipcode: undefined,
      currentSelection: undefined,
      isNominating: true,
      restaurants: [],
      loggedInUsername: null,
    };
    this.roomID = this.props.match.params.roomID;

    this.nominateRestaurant = this.nominateRestaurant.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.voteApprove = this.voteApprove.bind(this);
    this.voteVeto = this.voteVeto.bind(this);

    this.socket = io.connect(process.env.PORT || 'http://localhost:3000');
    this.socket.on('chat', roomID => {
      if (roomID === this.roomID) {
        console.log('Received message');
        this.getMessages();
      }
    });
    this.socket.on('vote', roomID => {
      if (roomID === this.roomID) {
        console.log('Received vote');
        this.getVotes();
      }
    });
  }

  // Send post request to server to fetch room info when user visits link
  componentDidMount() {
    this.getMessages();
    this.getRoomInfo();
    this.getVotes();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('PREVPROPS', prevProps, 'PREVSTATE', prevState);
  //   if (this.props.username !== null && prevState.loggedInUsername !== this.state.loggedInUsername && this.state.loggedInUsername === null) {
  //     this.setState({
  //       loggedInUsername: this.props.username,
  //     });
  //   };
  // };
  
  getMessages() {
    $.get(`/api/messages/${this.roomID}`).then(messages => {
      console.log('GOT MESSAGES', messages);
      this.setState({
        messages: messages,
      });
    });
  }

  getRoomInfo() {
    $.get(`/api/rooms/${this.roomID}`).then(roomMembers => {
      console.log('GOT ROOM MEMBERS', roomMembers);
      this.setState({
        members: roomMembers,
        zipcode: roomMembers[0].rooms[0].zipcode,
      });
    });
  }

  getVotes() {
    $.get(`/api/votes/${this.roomID}`).then(restaurants => {
      console.log('GOT RESTAURANTS', restaurants);
      this.setState({
        restaurants: restaurants,
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
      let voteObj = {
        name: restaurant.name,
        roomID: this.roomID,
        votes: 0,
        vetoed: false,
      };
      console.log('VOTEOBJ', voteObj);
      $.post('/api/votes', voteObj).then(() => {
        this.socket.emit('vote', voteObj);
      });
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
    $.post('/api/messages', messageObj).then(() => {
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
    
    let voteObj = {
      restaurant: '', // FILL THIS IN
      type: '', // FILL THIS IN
      roomID: this.roomID,
    };
    $.post('/api/votes', voteObj).then(() => {
      this.socket.emit('vote', voteObj);
    });
  }

  voteVeto() {
    this.setState({
      isNominating: true,
      currentSelection: undefined,
    });
  }

  render() {
    let restaurantList = this.state.zipcode
      ? <RestaurantList zipcode={this.state.zipcode} nominate={this.nominateRestaurant}/>
      : ('')
    let currentSelection = this.state.currentSelection
      ? <CurrentSelection restaurant={this.state.currentSelection} />
      : <div>Please nominate a restaurant</div>
    return (
      <div>
        {/* <div className="is-divider" /> */}
        <div className="columns">
          <div id="yelp-list" className="column">
            <h3 className="is-size-3">Local Resturants</h3>
            {restaurantList}
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
