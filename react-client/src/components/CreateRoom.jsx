import React from 'react';
import $ from 'jquery';
import uniqueString from 'unique-string';

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      roomID: null,
      zipCode: '',
    };
  }

  createRoom() {
    this.state.emails.forEach(email => this.sendInvite(email));
    $.post(
      '/api/save',
      { id: this.state.roomID, members: this.state.emails, zip: this.state.zipCode },
      (data, status) => {
        console.log(`Room ${this.state.roomID} saved to the database:`, status);
      },
    );
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

  updateZip(e) {
    this.setState({
      zipCode: e.target.value,
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
<<<<<<< HEAD
        <div id="create-room-footer">
=======
        <div className="column is-half">
          <input
            type="text"
            pattern="[0-9]{5}"
            title="Five digit zip code"
            value={this.state.zipCode}
            onChange={this.updateZip.bind(this)}
            className="input is-large is-half"
            placeholder="Zip Code"
          />{' '}
          <input
            type="email"
            value={this.state.query}
            onChange={this.updateQuery.bind(this)}
            className="input is-large is-half"
            placeholder="Email"
          />{' '}
          <button onClick={this.addEmail.bind(this)} className="button">
            {' '}
            Invite{' '}
          </button>
          {this.state.emails.map((email, index) => {
            return <li key={index}>Invitation will be sent to {email}</li>;
          })}
        </div>
        <div>
>>>>>>> 3c75fd3cd8337c1d654279c633cefebc9c41829d
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
