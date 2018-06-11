import React from 'react';
import validator from 'validator';
import { Route, Link } from 'react-router-dom';

class SubscribeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: '',
      emailValid: false,
      password: '',
      zip: '',
      zipValid: false,

      error: false
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.enterEmail = this.enterEmail.bind(this);
    this.enterPassword = this.enterPassword.bind(this);
    this.enterZip = this.enterZip.bind(this);
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
      emailValid: false,
      password: '',
      zip: '',
      zipValid: false
    });
  }

  enterEmail(e) {
    console.log(e.target.value);
    if (validator.isEmail(e.target.value)) {
      this.setState({
        email: e.target.value,
        emailValid: true
      });
    } else {
      this.setState({
        email: e.target.value,
        emailValid: false
      });
    }
  }

  enterPassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  enterZip(e) {
    if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/).test(String(e.target.value))) {
      this.setState({
        zip: e.target.value,
        zipValid: true
      });
    } else {
      this.setState({
        zip: e.target.value,
        zipValid: false
      });
    }
  }

  handleSubscribe() {
    this.props.subscribe(
      this.state.email,
      this.state.password,
      this.state.zip);
  }


  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //
  render() {
    // Toggle show modal
    const isActive = this.state.open ? (
      { className: 'modal is-active animated fadeIn' }
    ) : { className: 'modal animated fadeIn' };

    // Validate email field
    let isEmailValid1 = this.state.emailValid ? (
      { className: 'input is-success' }
    ) : { className: 'input is-danger' };

    let isEmailValid2 = this.state.emailValid ? null : (
      <p className="help is-danger">
        Please enter a valid email address.
      </p>
    );

    // Validate zip field
    let isZipValid1 = this.state.zipValid ? (
      { className: 'input is-success' }
    ) : { className: 'input is-danger' };

    let isZipValid2 = this.state.zipValid ? null : (
      <p className="help is-danger">
        Please enter a valid zip code.
      </p>
    );

    // Login error
    const subscribeError = this.props.subscribeError ? (
      <section className="section login-error">
        <div className="container">
          <h2 className="subtitle">
            That username is already taken.
              </h2>
        </div>
      </section>
    ) : null;

    return (
      <div>
        <a className="button is-primary" onClick={this.handleClickOpen}>
          Sign Up
        </a>
        <div {...isActive} >
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                Sign Up
            </p>
              <button
                className="delete"
                aria-label="close"
                onClick={this.handleClose}
              ></button>
            </header>
            <section className="modal-card-body">
              {subscribeError}
              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                  <input
                    {...isEmailValid1}
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={this.state.email}
                    onChange={this.enterEmail} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </div>
                {isEmailValid2}
              </div>
              <div className="field">
                <label className="label">Password</label>
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    placeholder="password123"
                    value={this.state.password}
                    onChange={this.enterPassword} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <label className="label">Homebase</label>
                <p className="control has-icons-left">
                  <input
                    {...isZipValid1}
                    placeholder="78701"
                    value={this.state.zip}
                    onChange={this.enterZip} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-home"></i>
                  </span>
                </p>
                {isZipValid2}
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
                onClick={this.handleSubscribe}>
                Go!
            </button>
            </footer>
          </div>
        </div>
      </div >
    );
  }
}

export default SubscribeDialog;