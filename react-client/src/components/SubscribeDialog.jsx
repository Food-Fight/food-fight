import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import validator from 'validator';

class SubscribeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: null,
      username: null,
      password: null,
      emailValid: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.enterEmail = this.enterEmail.bind(this);
    this.enterUsername = this.enterUsername.bind(this);
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

  enterUsername(e) {
    this.setState({
      username: e.target.value
    });
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
      this.state.username,
      this.state.password);
  }

  render() {
    let isEmailValid = this.state.emailValid ? null : {
      error: true,
      helperText: 'Please enter a valid email address'
    };

    return (
      <div>
        <Button onClick={this.handleClickOpen}>Subscribe</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <TextField
              {...isEmailValid}
              id="full-width"
              label="Email"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              fullWidth
              margin="normal"
              autoFocus={true}
              onChange={this.enterEmail}
            />
            <TextField
              id="full-width"
              label="Username"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              fullWidth
              margin="normal"
              onChange={this.enterUsername}
            />
            <TextField
              id="full-width"
              label="Password"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              fullWidth
              margin="normal"
              type="password"
              onChange={this.enterPassword}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} >
              Cancel
            </Button>
            <Button onClick={this.handleSubscribe} >
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
}

export default SubscribeDialog;