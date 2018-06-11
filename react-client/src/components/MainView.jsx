import React from 'react';
import Hero from './Hero.jsx';
import RestaurantList from './RestaurantList.jsx';
import CreateRoomContainer from './createRoomContainer/CreateRoomContainer.jsx';
import Room from './Room.jsx';
import { Route } from 'react-router-dom';

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: '',
    }
  }

  componentDidMount() {
    this.setState({
      loggedInUser: this.props.loggedInUser
    });
  }

  render() {
    return (
      <div>
        <Hero />,
        <Route exact path="/" render={
          (props) => <CreateRoomContainer
            searchUsers={this.props.searchUsers}
            searchedUsers={this.props.searchedUsers}
            loggedIn={this.props.loggedIn}
            loggedInUser={this.props.loggedInUser}
            {...props} />} />,
        < Route path="/rooms/:roomID" component={Room} />
      </div>
    )
  }
}

export default MainView;