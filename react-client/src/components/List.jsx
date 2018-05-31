import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    Enter a zip code: 
    <input type="text" /> <button> Search </button>
    { props.items.map(item => <ListItem item={item}/>)}
  </div>
)

export default List;