import React from 'react';
import Combatant from './Combatant.jsx'

class CombatantsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <p className="title">
          Combatants
        </p>
        <div className="tile is-ancestor" >
          <div className="tile is-parent is-vertical is-4">
            {/* {this.props.combatants} */}
            {this.props.combatants.filter((email, i) => i % 3 === 0)
              .map((email, i) => {
                return <Combatant key={i} email={email} />
              })}
          </div>
          <div className="tile is-parent is-vertical is-4">
            {this.props.combatants.filter((email, i) => i % 3 === 1)
              .map((email, i) => {
                return <Combatant key={i} email={email} />
              })}
          </div>
          <div className="tile is-parent is-vertical is-4">
            {this.props.combatants.filter((email, i) => i % 3 === 2)
              .map((email, i) => {
                return <Combatant key={i} email={email} />
              })}
          </div>
        </div>
      </div>
    )
  }
}

export default CombatantsContainer;