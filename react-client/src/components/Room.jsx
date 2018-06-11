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
      //This is just dummy data to test the Scoreboard
      votes: [
        { name: 'Imperial River Company', votes: 1, vetoed: true },
        { name: 'The Riverside', votes: 2, vetoed: false },
        { name: "Henry's Deli Mart", votes: 3, vetoed: true },
      ],
      loggedInUsername: null,
      roomName: '',
    };
    this.roomID = this.props.match.params.roomID;

    this.nominateRestaurant = this.nominateRestaurant.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.voteApprove = this.voteApprove.bind(this);
    this.voteVeto = this.voteVeto.bind(this);

    this.socket = io.connect(process.env.PORT || 'http://localhost:3000');
    this.socket.on('chat', message => {
      if (message.roomID === this.roomID) {
        console.log('Received message', message);
        this.setState({
          messages: [...this.state.messages, message.message],
        });
        //this.getMessages();
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
    //this.getMessages();
    this.getRoomInfo();
    this.getVotes();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps, prevState);
  // }

  getMessages() {
    $.get(`/api/messages/${this.roomID}`).then(messages => {
      // console.log('GOT MESSAGES', messages);
      this.setState({
        messages: messages,
      });
    });
  }

  getRoomInfo() {
    $.get(`/api/rooms/${this.roomID}`).then(roomMembers => {
      // console.log('GOT ROOM MEMBERS', roomMembers);
      this.setState({
        members: roomMembers,
        zipcode: roomMembers[0].rooms[0].zipcode,
        roomName: roomMembers[0].rooms[0].name,
      });
    });
  }

  getVotes() {
    $.get(`/api/votes/${this.roomID}`).then(restaurants => {
      // console.log('GOT VOTES', restaurants);
      this.setState({
        votes: restaurants,
      });
    });
  }

  nominateRestaurant(restaurant) {
    if (this.state.isNominating) {
      this.setState({
        currentSelection: restaurant,
        isNominating: false,
      });
      let voteObj = {
        name: restaurant.name,
        roomID: this.roomID,
      };
      // console.log('VOTEOBJ', voteObj);
      $.post('/api/nominate', voteObj).then(() => {
        this.socket.emit('nominate', voteObj);
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
    // console.log('STATE', this.state);
    let voteObj = {
      name: this.state.currentSelection.name,
      roomID: this.roomID,
    };
    // console.log('VOTEOBJ VOTE', voteObj);
    $.post('/api/votes', voteObj).then(() => {
      this.socket.emit('vote', voteObj);
    });
  }

  voteVeto() {
    let voteObj = {
      name: this.state.currentSelection.name,
      roomID: this.roomID,
    };
    this.setState({
      isNominating: true,
      currentSelection: undefined,
    });
    // console.log('VOTEOBJ VOTE', voteObj);
    $.post('/api/vetoes', voteObj).then(() => {
      this.socket.emit('veto', voteObj);
    });
  }

  render() {
    let restaurantList = this.state.zipcode ? (
      <RestaurantList zipcode={this.state.zipcode} nominate={this.nominateRestaurant} />
    ) : (
      ''
    );
    let currentSelection = this.state.currentSelection ? (
      <CurrentSelection restaurant={this.state.currentSelection} />
    ) : (
      <div>Please nominate a restaurant</div>
    );
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
            <button onClick={this.voteApprove} className="button is-success">
              Approve
            </button>
            <button onClick={this.voteVeto} className="button is-danger">
              Veto
            </button>
            <div>
              <h3 className="is-size-3">Scoreboard</h3>
              <table className="table is-striped is-bordered is-fullwidth">
                <thead>
                  <th>Resturant</th>
                  <th>Votes</th>
                </thead>
                <tbody>
                  {this.state.votes
                    .sort((a, b) => {
                      return b.votes - a.votes;
                    })
                    .map(restaurant => (
                      // <h5 style={{ backgroundColor: restaurant.vetoed ? 'white' : 'lightgrey' }}>
                      //   <strong>{restaurant.name}</strong> {restaurant.votes}
                      // </h5>
                      <tr className={restaurant.vetoed ? 'is-selected' : ''}>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.votes}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div id="chat" className="column">
            <h3 className="is-size-3">Welcome to Room {this.state.roomName}</h3>
            <div>
              {/* Need to figure out how we're going to display room members and zipcode */}
              Members: {this.state.members.map(user => <span>{user.email} </span>)}
            </div>
            <div>Zipcode: {this.state.zipcode}</div>
            <h4 className="is-size-4">Live Chat</h4>
            <div>
              Name{' '}
              <input type="text" value={this.state.name} onChange={this.updateName.bind(this)} />
            </div>
            <span>
              Message{' '}
              <input
                type="text"
                value={this.state.message}
                onChange={this.updateMessage.bind(this)}
              />
            </span>
            <button onClick={this.sendMessage.bind(this)}>Send</button>
            <div>
              {this.state.messages.map(message => (
                <p>
                  <strong>{message.name}:</strong> {message.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Room;
