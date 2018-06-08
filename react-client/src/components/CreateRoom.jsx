import React from 'react';
import $ from 'jquery';
import uniqueString from 'unique-string';

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      roomID: null,
    };
  }

  createRoom() {
    this.state.emails.forEach(email => this.sendInvite(email));
    $.post('/api/save', { id: this.state.roomID, members: this.state.emails }, (data, status) => {
      console.log(`Room ${this.state.roomID} saved to the database:`, status);
    });
  }

  createUniqueID() {
    this.setState({
      roomID: uniqueString(),
    });
  }

  updateQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  render() {
    var uniqueURL = this.state.roomID
      ? `https://food-fight-greenfield.herokuapp.com/rooms/${this.state.roomID}`
      : '';

    return (
      <div>
        <div>
          <div className="field">
            <div className="field-label is-large">
              <label id="arena-lable" className="label">
                NAME YOUR ARENA
                </label>
            </div>
            <div className="control has-icons-left">
              <input className="input is-large" type="text" placeholder="Large input" />
              <span className="icon is-small is-left">
                <i className="fas fa-skull"></i>
              </span>
            </div>
          </div>
          <button onClick={this.createUniqueID.bind(this)} className="button is-normal is-info">
            Create a Unique URL
          </button>
          {uniqueURL}
        </div>
        <div id="create-room-footer">
          <div className="is-divider" />
          <button
            id="fight-button"
            onClick={this.createRoom.bind(this)}
            className="button is-primary is-large is-fullwidth">
            Fight!
          </button>
        </div>
      </div>
    );
  }
}

export default CreateRoom;
