import React from 'react';
import LoginDialog from './LoginDialog.jsx';
import SubscribeDialog from './SubscribeDialog.jsx';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a className="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="http://localhost:4000" target="_blank" href="https://twitter.com/intent/tweet?text=Bulma: a modern CSS framework based on Flexbox&amp;hashtags=bulmaio&amp;url=http://localhost:4000&amp;via=jgthms">
                  <span className="icon">
                    <i className="fab fa-twitter"></i>
                  </span>
                  <span>
                    Tweet
              </span>
                </a>
              </p>
              <p className="control">
                <LoginDialog
                  login={this.props.login}
                  error={this.props.error} />
              </p>
              <p className="control">
                <SubscribeDialog
                  subscribe={this.props.subscribe} />
              </p>
            </div>
          </div>
        </div>
      </nav >
    );
  }
}

export default Navbar;
