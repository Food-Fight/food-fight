import React from 'react';
import $ from 'jquery';
// import uniqueString from 'unique-string';
import CombatantsContainer from './CombatantsContainer.jsx';

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      roomID: null,
      roomName: '',
      zipCode: '',
    };
  }

  createRoom() {
    $.post(
      '/api/save',
      {
        roomName: this.state.roomName,
        zip: this.state.zipCode,
        members: this.props.combatants
      },
      (data, status) => {
        console.log(`Room ${this.state.roomID} saved to the database:`, status);
      },
    );
  }

  // createUniqueID() {
  //   this.setState({
  //     roomID: uniqueString(),
  //   });
  // }

  updateQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  updateRoomName(e) {
    this.setState({
      roomName: e.target.value,
    });
  }

  updateZip(e) {
    this.setState({
      zipCode: e.target.value,
    });
  }

  render() {
    var uniqueURL = this.state.roomID ?
      `https://food-fight-greenfield.herokuapp.com/rooms/${this.state.roomID}`
      : '';

    return (
      <div>
        <div>
          <p className="title">
            Create Your Arena
          </p>
          <div className="columns">
            <div className="column is-three-quarters">
              <div className="field">
                <label className="label">Name</label>
                <p className="control is-expanded">
                  <input
                    className="input is-large"
                    type="text"
                    placeholder="Arena name..."
                    value={this.state.roomName}
                    onChange={this.updateRoomName.bind(this)} />
                </p>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Region</label>
                <p className="control is-expanded">
                  <input
                    type="text"
                    pattern="[0-9]{5}"
                    title="Five digit zip code"
                    value={this.state.zipCode}
                    onChange={this.updateZip.bind(this)}
                    className="input is-large is-half"
                    placeholder="Zip Code"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <button onClick={this.createUniqueID.bind(this)} className="button is-normal is-info">
            Create a Unique URL
          </button>
          {uniqueURL} */}
        <div className="is-divider" />
        <CombatantsContainer
          combatants={this.props.combatants} />
        <div id="create-room-footer">
          <div>
            <div className="is-divider" />
            <button
              id="fight-button"
              onClick={this.createRoom.bind(this)}
              className="button is-primary is-large is-fullwidth">
              Fight!
          </button>
          </div>
        </div>
      </div >
    );
  }
}

export default CreateRoom;
