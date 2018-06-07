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
            <a className="user-search-button button is-info is-small">
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