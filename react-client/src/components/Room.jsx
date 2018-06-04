import React from 'react';

class Room extends React.Component {
  constructor(props) {
    super(props);
  }

//TO DO: Get room information from the database

render() {
  return (
    <div>
        Welcome to room {this.props.match.params.roomID}    
        {/* TO DO: Render room information to the page */}
    </div>
    )
  } 

}
export default Room;