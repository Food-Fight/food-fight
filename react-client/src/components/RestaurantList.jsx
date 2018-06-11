import React from 'react';
import $ from 'jquery';
import RestaurantListItem from './RestaurantListItem.jsx';

class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      isFirstTime: true,
    };
  }
  searchYelp() {
    $.post('/api/search', { zip: this.props.zipcode }, (data, status) => {
      console.log(`Requested Yelp search for ${this.props.zipcode}:`, status);
      if (data.businesses) {
        this.setState({
          restaurants: data.businesses,
        });
      }
    });
  }

  componentDidMount() {
    this.searchYelp();
  }

  componentDidUpdate() {
    this.setNominee();
  }

  //Attempt at getting Yelp information of the current nominee upon visiting the page
  setNominee() {
    if (this.state.isFirstTime && this.props.currentName) {
      this.state.restaurants.forEach(restaurant => {
        if (restaurant.name === this.props.currentName) {
          this.props.nominate(restaurant, true);
          this.setState({
            isFirstTime: false,
          });
        }
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.restaurants.map(restaurant => {
          return <RestaurantListItem restaurant={restaurant} nominate={this.props.nominate} />;
        })}
      </div>
    );
  }
}
export default RestaurantList;
