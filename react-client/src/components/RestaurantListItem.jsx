import React from 'react';

const RestaurantListItem = props => (
  <div className="Resturant-list-item">
    <h4>{props.restaurant.name}</h4>
    <img src={props.restaurant.image_url} className="resturant-img hidden" />
    Categories:{' '}
    <ul>
      {props.restaurant.categories.map(category => {
        return <li>{category.title}</li>;
      })}
    </ul>
  </div>
);

export default RestaurantListItem;
