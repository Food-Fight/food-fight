import React from 'react';
import LoginDialog from './Users/LoginDialog.jsx';
import SubscribeDialog from './AuthUserMenu/SubscribeDialog.jsx';
import UserMenu from './AuthUserMenu/UserMenu.jsx';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let authentication = this.props.loggedIn ? (
      <UserMenu
        logout={this.props.logout}
        username={this.props.username} />
    ) : (
        [<div className="control">
          <LoginDialog
            login={this.props.login}
            error={this.props.error} />
        </div>,
        <div className="control">
          <SubscribeDialog
            subscribe={this.props.subscribe} />
        </div>]
      );

    return (
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <h1 id="logo">FoodFight!</h1>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a className="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="http://localhost:4000" target="_blank" href="https://twitter.com/intent/tweet?text=Let's get ready to Food Fight!">
                  <span className="icon">
                    <i className="fab fa-twitter"></i>
                  </span>
                  <span>
                    Tweet
                  </span>
                </a>
              </p>
              {authentication}
            </div>
          </div>
        </div>
      </nav >
    );
  }
}

export default Navbar;
