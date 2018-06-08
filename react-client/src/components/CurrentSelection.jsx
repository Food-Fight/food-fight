import React from 'react';

const CurrentSelection = props => (
  <article className="media Resturant-list-item">
    <figure className="media-left">
      <p className="image is-64x64">
        <img src={props.restaurant.image_url} className="resturant-img hidden" />
      </p>
    </figure>
    <div className="media-content">
      <div className="content">
        <p>
          <strong>{props.restaurant.name}</strong>
        </p>
        <ul>
          {props.restaurant.categories.map(category => {
            return <li>{category.title}</li>;
          })}
        </ul>
      </div>
    </div>
  </article>
);

export default CurrentSelection;
