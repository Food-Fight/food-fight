import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import validator from 'validator';

class SubscribeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: null,
      password: null,
      emailValid: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.enterEmail = this.enterEmail.bind(this);
    this.enterPassword = this.enterPassword.bind(this);
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
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

  handleSubscribe() {
    this.setState({
      open: false
    });
    this.props.subscribe(
      this.state.email,
      this.state.password);
  }

  render() {
    console.log('ERROR', this.props.error);
    const loginError = this.props.error ? (
      <DialogContentText id="login-error">
        That user does not exist.
      </DialogContentText>
    ) : null;

    let isEmailValid = this.state.emailValid ? null : {
      error: true,
      helperText: 'Please enter a valid email address'
    };

    // Toggle show modal
    const isActive = this.state.open ? (
      { className: 'modal is-active animated fadeIn' }
    ) : { className: 'modal animated fadeIn' };

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
              <div className="field">
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    onChange={this.enterEmail} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <span className="icon is-small is-right">
                    <i className="fas fa-check"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <p className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    onChange={this.enterPassword} />
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
                onClick={this.handleSubscribe}>
                Go!
            </button>
            </footer>
          </div>
        </div>
      </div >
      // <div>
      //   <Button onClick={this.handleClickOpen}>Subscribe</Button>
      //   <Dialog
      //     open={this.state.open}
      //     onClose={this.handleClose}
      //     aria-labelledby="form-dialog-title"
      //   >
      //     <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      //     <DialogContent>
      //       <TextField
      //         {...isEmailValid}
      //         id="full-width"
      //         label="Email"
      //         // InputLabelProps={{
      //         //   shrink: true,
      //         // }}
      //         fullWidth
      //         margin="normal"
      //         autoFocus={true}
      //         onChange={this.enterEmail}
      //       />
      //       <TextField
      //         id="full-width"
      //         label="Username"
      //         // InputLabelProps={{
      //         //   shrink: true,
      //         // }}
      //         fullWidth
      //         margin="normal"
      //         onChange={this.enterUsername}
      //       />
      //       <TextField
      //         id="full-width"
      //         label="Password"
      //         // InputLabelProps={{
      //         //   shrink: true,
      //         // }}
      //         fullWidth
      //         margin="normal"
      //         type="password"
      //         onChange={this.enterPassword}
      //       />
      //     </DialogContent>
      //     <DialogActions>
      //       <Button onClick={this.handleClose} >
      //         Cancel
      //       </Button>
      //       <Button onClick={this.handleSubscribe} >
      //         Subscribe
      //       </Button>
      //     </DialogActions>
      //   </Dialog>
      // </div >
    );
  }
}

export default SubscribeDialog;