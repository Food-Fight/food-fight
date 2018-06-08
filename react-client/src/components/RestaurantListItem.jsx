import React from 'react';

const RestaurantListItem = props => (
  <div>
    {console.log(props.restaurant.name)}
    {/* <img src={props.restaurant.image_url} />
    Categories:{' '} */}
    {/* {props.restaurant.categories.map(category => {
      return <li>{category.title}</li>;
    })} */}
  </div>
);

export default RestaurantListItem;
