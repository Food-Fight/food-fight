import React from 'react';

class SearchUsersPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tile is-parent">
        <article className="tile is-child notification">
          <div className="content">
            <p className="title">Find Users</p>
            <input className="input" type="text" placeholder="Text input" />
            <div className="content">
            </div>
          </div>
        </article>
      </div>
    );
  }
}

export default SearchUsersPanel;
