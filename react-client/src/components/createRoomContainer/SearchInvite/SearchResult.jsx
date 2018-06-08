import React from 'react';

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="search-result">
          <p className="user-search-email">
            {this.props.user.email}
          </p>
          <span>
            <a
              className="user-search-button button is-info is-small"
              onClick={this.props.addCombatant.bind(this, this.props.user.email)}>
              <span>Add</span>
              <span className="icon is-small">
                <i className="fas fa-angle-right"></i>
              </span>
            </a>
          </span>
        </div>
      </div>
    )
  }
}

export default SearchResult;