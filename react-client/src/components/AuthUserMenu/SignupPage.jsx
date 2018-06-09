import React from 'react';
import validator from 'validator';
import { Link } from 'react-router-dom';

class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      emailValid: false,
      password: null,
      zip: null,
      zipValid: false,
    };
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.enterEmail = this.enterEmail.bind(this);
    this.enterPassword = this.enterPassword.bind(this);
    this.enterZip = this.enterZip.bind(this);
  }

  enterEmail(e) {
    if (validator.isEmail(e.target.value)) {
      this.setState({
        email: e.target.value,
        emailValid: true
      });
    } else {
      this.setState({
        email: null,
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
        zip: null,
        zipValid: false
      });
    }
  }

  handleSubscribe() {
    console.log(this.props.subscribe);
    console.log('ZIP', this.state.zip);
    this.props.subscribe(
      this.state.email,
      this.state.password,
      this.state.zip);
  }

  render() {
    console.log('L:KSJDF');
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

    // Link only active if

    return (
      <div className="columns tile is-ancestor">
        <div className="column is-1"></div>
        <div id="google-login-container" className="column is-2">
          <div id="google-login-card" className="card">
            <header className="card-header">
              <p className="card-header-title">
                Login With Google
              </p>
            </header>
            <div className="card-content">
              <div id="google-login-content" className="content">
                <figure className="image is-128x128">
                  <img src="https://image.flaticon.com/icons/svg/270/270014.svg" />
                </figure>
              </div>
            </div>
            <footer className="card-footer">
              <a href="/auth/google" className="card-footer-item">Login</a>
            </footer>
          </div>
        </div>
        <div id="signup-or-container" className="column is-2">
          <p id="signup-or" className="title">OR</p>
        </div>
        <div className="column is-6 tile is-parent is-vertical">
          <div className="tile is-child notification">
            <p className="title">Sign Up!</p>
            <div className="is-divider" />
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
            <div className="is-divider" />
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button
                className="button is-success is-fullwidth"
                onClick={this.handleSubscribe}>
                Go!
            </button>
            </Link>
          </div>
        </div>
      </div>
      // <div className='modal is-active' >
      //   <div className="modal-background"></div>
      //   <div className="modal-card">
      //     <header className="modal-card-head">
      //       <p className="modal-card-title">
      //         Sign Up
      //       </p>
      //       <button
      //         className="delete"
      //         aria-label="close"
      //         onClick={this.handleClose}
      //       ></button>
      //     </header>
      //     <section className="modal-card-body">
      //       <div className="field">
      //         <label className="label">Email</label>
      //         <div className="control has-icons-left">
      //           <input
      //             {...isEmailValid1}
      //             type="email"
      //             placeholder="johndoe@gmail.com"
      //             value={this.state.email}
      //             onChange={this.enterEmail} />
      //           <span className="icon is-small is-left">
      //             <i className="fas fa-envelope"></i>
      //           </span>
      //         </div>
      //         {isEmailValid2}
      //       </div>
      //       <div className="field">
      //         <label className="label">Password</label>
      //         <p className="control has-icons-left">
      //           <input
      //             className="input"
      //             type="password"
      //             placeholder="password123"
      //             value={this.state.password}
      //             onChange={this.enterPassword} />
      //           <span className="icon is-small is-left">
      //             <i className="fas fa-lock"></i>
      //           </span>
      //         </p>
      //       </div>
      //       <div className="field">
      //         <label className="label">Homebase</label>
      //         <p className="control has-icons-left">
      //           <input
      //             {...isZipValid1}
      //             placeholder="78701"
      //             value={this.state.zip}
      //             onChange={this.enterZip} />
      //           <span className="icon is-small is-left">
      //             <i className="fas fa-home"></i>
      //           </span>
      //         </p>
      //         {isZipValid2}
      //       </div>
      //     </section>
      //     <footer className="modal-card-foot">
      //       <button
      //         className="button"
      //         onClick={this.handleClose}>
      //         Cancel
      //         </button>
      //       <button
      //         className="button is-success"
      //         onClick={this.handleSubscribe}>
      //         Go!
      //       </button>
      //     </footer>
      //   </div>
      // </div >
    );
  }
}

export default SignupPage;
