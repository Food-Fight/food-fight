require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const request = require('request');

// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
// var items = require('../database-mongo');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// UNCOMMENT FOR REACT
app.use(express.static(`${__dirname}/../react-client/dist`));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.post('/search', (req, res) => {
  console.log('Received request', req.body);
  const { zip } = req.body;
  // To Do: Store the zip code and other relavent information in the database
  const options = {
    method: 'GET',
    uri: 'https://api.yelp.com/v3/businesses/search',
    headers: {
      Authorization: process.env.YELP_API_KEY,
    },
    qs: {
      location: zip,
    },
  };
  request(options, (err, data) => {
    if (err) {
      console.log('Error in interacting with the Yelp API', err);
      res.statusCode(404).end();
    }
    res.send(JSON.parse(data.body));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port', process.env.PORT || 3000);
});
