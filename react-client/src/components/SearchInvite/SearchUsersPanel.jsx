import React from 'react';

class SearchUsersPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
                  placeholder="Email" />
              </div>
              <div className="control">
                <a className="button is-info">
                  Search
                </a>
              </div>
            </div>
          </div>
        </div>
      </article >
    );
  }
}

export default SearchUsersPanel;
