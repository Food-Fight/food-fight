import React from 'react';

class Combatant extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <article className="tile is-child notification combatants">
          <div className="content">
            <p className="user-search-email">
              {this.props.email}
            </p>
          </div>
        </article>
      </div>
    )
  }
}

export default Combatant;