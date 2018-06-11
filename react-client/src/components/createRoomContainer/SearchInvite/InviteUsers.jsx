import React from 'react';
import $ from 'jquery';
import Invitation from './Invitation.jsx';
import validator from 'validator';


class InviteUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      emails: [],
      emailValid: false,
      error: false,
    }
    this.inviteAll = this.inviteAll.bind(this);
  }

  addEmail() {
    if (this.state.emailValid) {
      this.state.emails.push(this.state.input);
      this.setState({
        input: '',
      });
    } else {
      this.setState({
        error: true,
      })
    }
  }

  updateInput(e) {
    if (validator.isEmail(e.target.value)) {
      this.setState({
        input: e.target.value,
        emailValid: true
      });
    } else {
      this.setState({
        input: e.target.value,
        emailValid: false
      });
    }
  }

  sendInvite(email) {
    $.post('/api/signupEmail', { email: email },
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

  closeError() {
    this.setState({
      error: false
    });
  }

  render() {
    // Validate email entry
    const checkEmailValid = () => {
      if (this.state.input.length === 0) {
        return { className: 'input' };
      } else if (this.state.emailValid) {
        return { className: 'input is-success' };
      } else {
        return { className: 'input is-danger' };
      }
    };

    // Render error if invalid entry
    const error = this.state.error ? (
      <div className="notification is-danger">
        <button
          className="delete"
          onClick={this.closeError.bind(this)}></button>
        Invalid email address.
      </div>
    ) : null;

    return (
      <article className="tile is-child notification">
        <div className="content">
          <p className="title">
            Invite Warriors
          </p>
          <div className="content">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="email"
                  value={this.state.input}
                  onChange={this.updateInput.bind(this)}
                  {...checkEmailValid()}
                  placeholder="Email" />
              </div>
              <div className="control">
                <a className="button is-info" onClick={this.addEmail.bind(this)}>
                  Add
                </a>
              </div>
            </div>
            {error}
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