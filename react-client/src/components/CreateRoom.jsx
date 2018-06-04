import React from "react";
import $ from "jquery";
import uniqueString from "unique-string";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      emails: [],
      roomID: null
    };
  }

  addEmail() {
    this.state.emails.push(this.state.query);
    this.setState({
      query: ""
    });
  }
  
  createRoom() {
    this.state.emails.forEach((email) => this.sendInvite(email));
    $.post("/api/save", { id: this.state.roomID,  members: this.state.emails }, (data, status) => {
      console.log(`Room ${this.state.roomID} saved to the database:`, status);
    });
  }
  
  createUniqueID() {
    this.setState({
      roomID: uniqueString()
    });
  }
  
  sendInvite(email) {
    $.post("/api/email", { email: email, id: this.state.roomID }, (data, status) => {
      console.log(`Email sent to ${email}:`, status);
    });
  }
  
  updateQuery(e) {
    this.setState({
      query: e.target.value
    });
  }

  render() {
    var uniqueURL = this.state.roomID ? 
      `https://food-fight-greenfield.herokuapp.com/rooms/${this.state.roomID}`
      : "";
    return (
      <div>
        <h1>Create a Room</h1>
        <div>
          <button onClick={this.createUniqueID.bind(this)}>
            Create a Unique URL{" "}
          </button>
          {uniqueURL}
        </div>
        Enter an email:
        <input
          type="text"
          value={this.state.query}
          onChange={this.updateQuery.bind(this)}
        />{" "}
        <button onClick={this.addEmail.bind(this)}> Invite </button>
        {this.state.emails.map((email, index) => {
          return <li key={index}>Invitation will be sent to {email}</li>;
        })}
        <div>
          <button onClick={this.createRoom.bind(this)}>Create Room</button>
        </div>
      </div>
    );
  }
}

export default CreateRoom;
