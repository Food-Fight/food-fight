import React from 'react';
import $ from 'jquery';
import validator from 'validator';


class InviteUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      emailValid: false,
      error: false,
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
    this.setState({
      input: ''
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
      <div>
        <p className="title">Invite New Users</p>
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
            <a className="button is-info" onClick={this.sendInvite.bind(this, this.state.input)}>
              Invite
          </a>
          </div>
        </div>
      </div>

    )
  }
}

export default InviteUsers;