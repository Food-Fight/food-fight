import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      query : ''
    };
  }

  componentDidMount() {
  }

  searchYelp() {
    $.post('/search', {zip: 27608}, (data, err) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
    });
  }

  updateQuery(e) {
    // this.setState({
    //   query : e.target.value
    // });
  }

  render () {
    return (<div>
      <h1>Food Fight</h1>
    Enter a zip code: 
    <input type="text" value={this.state.query} onChange={this.updateQuery.bind(this)}/> <button onClick={this.searchYelp.bind(this)}> Search </button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));