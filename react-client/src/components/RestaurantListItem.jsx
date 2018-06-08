import React from 'react';

class RestaurantListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.nominate(this.props.restaurant);
  }

  render() {
    return (
      <article className="media Resturant-list-item" onClick={this.handleClick}>
        <figure className="media-left">
          <p className="image is-64x64">
            <img src={this.props.restaurant.image_url} className="resturant-img hidden" />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{this.props.restaurant.name}</strong>
            </p>
            <ul>
              {this.props.restaurant.categories.map(category => {
                return <li>{category.title}</li>;
              })}
            </ul>
          </div>
        </div>
      </article>
    )
  }
}

export default RestaurantListItem;
