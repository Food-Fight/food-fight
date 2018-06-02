require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const request = require('request');

const Mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET,
);

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

app.post('/api/email', (req, res) => {
  console.log('Received request to send email to', req.body.email);
  const { email, id } = req.body;
  const emailData = {
    FromEmail: 'foodfightHR@gmail.com',
    FromName: 'Food Fight',
    Subject: 'You\'ve been invited to a Food Fight!',
    'Text-part': `You've been invited to a new Food Fight. Visit ${process.env.DOMAIN || 'http://localhost:3000'}/${id} to begin.`,
    Recipients: [{ Email: email }],
  };
  Mailjet.post('send')
    .request(emailData)
    .then(() => {
      res.end('Email sent!');
    })
    .catch((err) => {
      console.log('Error in interacting with the MailJet API', err);
      res.status(404).end();
    });
});

app.post('/api/search', (req, res) => {
  console.log('Received request for Yelp search of', req.body);
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
      res.status(404).end();
    }
    res.send(JSON.parse(data.body));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port', process.env.PORT || 3000);
});
