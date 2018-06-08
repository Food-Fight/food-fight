import React from 'react';
import $ from 'jquery';
import uniqueString from 'unique-string';

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      emails: [],
      roomID: null,
      zipCode: '',
    };
  }

  addEmail() {
    this.state.emails.push(this.state.query);
    this.setState({
      query: '',
    });
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

  sendInvite(email) {
    $.post('/api/email', { email: email, id: this.state.roomID }, (data, status) => {
      console.log(`Email sent to ${email}:`, status);
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
          <button onClick={this.createUniqueID.bind(this)} className="button is-normal is-info">
            Create a Unique URL{' '}
          </button>
          {uniqueURL}
        </div>
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
          <div className="is-divider" />
          <button onClick={this.createRoom.bind(this)} className="button is-primary is-normal">
            Create Room
          </button>
        </div>
      </div>
    );
  }
}

export default CreateRoom;
