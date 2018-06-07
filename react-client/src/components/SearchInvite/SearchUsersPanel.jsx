import React from 'react';

class SearchUsersPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    }

    this.enterQuery = this.enterQuery.bind(this);
  }

  enterQuery(e) {
    this.setState({
      query: e.target.value,
    })
  }

  render() {
    console.log('FOUND USERS', this.props.foundUsers)
    return (
      <article className="tile is-child notification">
        <div className="content">
          <p className="title">Find Users</p>
          <div className="content">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  value={this.state.query}
                  onChange={this.enterQuery} />
              </div>
              <div className="control">
                <a
                  className="button is-info"
                  onClick={this.props.searchUsers.bind(this, this.state.query)}>
                  Search
                </a>
              </div>
            </div>
            <ul>
              {this.props.foundUsers.map(user => {
                return <li>{user.email}</li>
              })}
            </ul>
          </div>
        </div>
      </article >
    );
  }
}

export default SearchUsersPanel;
