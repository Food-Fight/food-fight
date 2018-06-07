import React, { Component } from 'react';

class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: '',
      password: '',
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.enterEmail = this.enterEmail.bind(this);
    this.enterPassword = this.enterPassword.bind(this);
  }


  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //
  handleClickOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({
      open: false,
      email: '',
      password: ''
    });
  }

  enterEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  enterPassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin() {
    this.props.login(this.state.email, this.state.password);
  }


  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //
  render() {
    // Toggle show modal
    const isActive = this.state.open ? (
      { className: 'modal is-active animated fadeIn' }
    ) : { className: 'modal animated fadeIn' };

    // Login error
    const loginError = this.props.error ? (
      <section className="section login-error">
        <div className="container">
          <h2 className="subtitle">
            Please try a different username or password.
          </h2>
        </div>
      </section>
    ) : null;

    return (
      <div>
        <a className="button is-primary" onClick={this.handleClickOpen}>
          <span>Login</span>
        </a>
        <div {...isActive} >
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                Login
              </p>
              <button
                className="delete"
                aria-label="close"
                onClick={this.handleClose}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="google-button-container">
                <a href="/auth/google">
                  <button
                    className="loginBtn loginBtn--google">
                    Login with Google
                </button>
                </a>
              </div>
              <hr />
              {loginError}
              <div className="field">
                <label className="label">Email</label>
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={this.state.email}
                    onChange={this.enterEmail} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    placeholder="password123"
                    value={this.state.password}
                    onChange={this.enterPassword}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button
                className="button"
                onClick={this.handleClose}>
                Cancel
              </button>
              <button
                className="button is-success"
                onClick={this.handleLogin}>
                Go!
              </button>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginDialog;