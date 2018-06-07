import React from 'react';

class Invitation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <div className="search-result">
          <p className="user-search-email">
            {this.props.email}
          </p>
        </div>
      </div>
    )
  }
}

export default Invitation;