import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import RestaurantList from "./components/RestaurantList.jsx";
import CreateRoom from "./components/CreateRoom.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      restaurants: []
    };
  }

  componentDidMount() {}

  searchYelp() {
    $.post("api/search", { zip: this.state.query }, (data, status) => {
      console.log(`Requested Yelp search for ${this.state.query}:`, status);
      if (data.businesses) {
        this.setState({
          restaurants: data.businesses
        });
      }
    });
  }

  updateQuery(e) {
    this.setState({
      query: e.target.value
    });
  }

  render() {
    return <CreateRoom />
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

ReactDOM.render(<App />, document.getElementById("app"));
