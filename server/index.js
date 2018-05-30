require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const request = require('request');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
// var items = require('../database-mongo');

const app = express();

app.use(bodyParser.json());

// UNCOMMENT FOR REACT
app.use(express.static(`${__dirname}/../react-client/dist`));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.post('/search', (req, res) => {
  const { zip } = req.body;
  let options = {
    method: 'GET',
    uri: 'https://api.yelp.com/v3/businesses/search',
    headers: {
      Authorization: process.env.YELP_API_KEY,
    },
    qs: {
      location: zip,
    }
  };
  request(options, (err, data) => {
    if (err) {
      console.log('Error in interacting with the Yelp API', err);
      res.statusCode(404).end();
    }
    // To Do: Add code to pass all this data on to the database
    res.send(data.body);
  });

  
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port', process.env.PORT || 3000);
});

