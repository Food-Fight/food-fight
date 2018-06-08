import React from 'react';
import SearchResult from './SearchResult.jsx';

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
    const usersFound = this.props.foundUsers.length ? (
      this.props.foundUsers.map(user => (
        <SearchResult user={user} />
      ))
    ) : (
        <p>No results found.</p>
      )

    return (
      <article className="tile is-child notification">
        <div className="content">
          <p className="title">Find Fighters</p>
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
            <div>
              {usersFound}
            </div>
          </div>
        </div>
      </article >
    );
  }
}

export default SearchUsersPanel;
