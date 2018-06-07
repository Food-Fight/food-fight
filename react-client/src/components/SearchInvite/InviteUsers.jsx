import React from 'react';
import $ from 'jquery';
import Invitation from './Invitation.jsx';


class InviteUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      emails: [],
    }
    this.inviteAll = this.inviteAll.bind(this);
  }

  addEmail() {
    // console.log(this.state.query);
    this.state.emails.push(this.state.query);
    this.setState({
      query: '',
    });
  }

  updateQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  sendInvite(email) {
    $.post('/api/email', { email: email },
      (data, status) => {
        console.log(`Email sent to ${email}:`, status);
      });
  }

  inviteAll() {
    this.state.emails.forEach(address => {
      this.sendInvite(address);
    });
    this.setState({
      emails: []
    });
  }

  render() {
    console.log(this.state.emails);
    return (
      <article className="tile is-child notification">
        <div className="content">
          <p className="title">Invite Users</p>
          <div className="content">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="email"
                  value={this.state.query}
                  onChange={this.updateQuery.bind(this)}
                  className="input"
                  placeholder="Email" />{' '}
              </div>
              <div className="control">
                <a className="button is-info" onClick={this.addEmail.bind(this)}>
                  Add
                </a>
              </div>
            </div>
            {this.state.emails.map((email) => {
              return <Invitation email={email} />
            })}
            <a
              id="send-invites"
              className="button is-info is-rounded"
              onClick={this.inviteAll}>
              Invite All
            </a>
          </div>
        </div>
      </article>
    )
  }
}

export default InviteUsers;