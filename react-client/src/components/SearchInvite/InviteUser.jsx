import React from 'react';

class InviteUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      emails: [],
    }
  }

  addEmail() {
    this.state.emails.push(this.state.query);
    this.setState({
      query: '',
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

  render() {
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
            {this.state.emails.map((email, index) => {
              return <li key={index}>Invitation will be sent to {email}</li>;
            })}
          </div>
        </div>
      </article>
    )
  }
}

export default InviteUser;