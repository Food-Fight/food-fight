import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import RestaurantList from './components/RestaurantList.jsx';
import CreateRoom from './components/CreateRoom.jsx';
import Room from './components/Room.jsx';

import 'bulma/css/bulma.css';
import './styles/main.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      restaurants: [],
    };
  }

  componentDidMount() { }

  searchYelp() {
    $.post('/api/search', { zip: this.state.query }, (data, status) => {
      console.log(`Requested Yelp search for ${this.state.query}:`, status);
      if (data.businesses) {
        this.setState({
          restaurants: data.businesses,
        });
      }
    });
  }

  updateQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <Navbar />
        <Hero />
        <section className="create-room-container">
          <h2 className="is-secondary title is-3"> Create A Room</h2>
          <BrowserRouter>
            <div className="container">
              <Route exact path="/" component={CreateRoom} />
              {/* TO DO: Check if a user has proper authentication and redirect accordingly */}
              <Route path="/rooms/:roomID" component={Room} />
            </div>
          </BrowserRouter>
        </section>
      </div>
    );

    //TO DO: Figure out where to put this
    //
    //   <div>
    //     <h1>Food Fight</h1>
    //     Enter a zip code:
    //     <input
    //       type="text"
    //       value={this.state.query}
    //       onChange={this.updateQuery.bind(this)}
    //     />{" "}
    //     <button onClick={this.searchYelp.bind(this)}> Search </button>
    //     <RestaurantList restaurants={this.state.restaurants} />
    //   </div>
    // )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
