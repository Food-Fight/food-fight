import React from 'react';
import $ from 'jquery';
import RestaurantListItem from './RestaurantListItem.jsx';
class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
    };
  }
  searchYelp() {
    $.post('/api/search', { zip: this.props.zipcode }, (data, status) => {
      console.log(`Requested Yelp search for ${this.props.zipcode}:`, status);
      if (data.businesses) {
        this.setState({
          restaurants: data.businesses,
        });
        console.log('YELP', this.state.restaurants);
      }
    });
  }

  componentDidMount() {
    this.searchYelp();
  }

  render() {
    return (
      <div>
        <h3>sup</h3>
      </div>
    );
  }
}
export default RestaurantList;
