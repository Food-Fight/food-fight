import React from 'react';
import RestaurantListItem from './RestaurantListItem.jsx';

const RestaurantList = (props) => (
  <div>
    {props.restaurants.map(restaurant => <RestaurantListItem restaurant={restaurant} />)}
  </div>
)

export default RestaurantList;