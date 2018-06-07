require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const request = require('request');
const passport = require('passport');
const flash = require('flash');
const auth = require('../lib/auth');
const morgan = require('morgan');
const socket = require('socket.io');

const Mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET,
);

const db = require('../database-postgresql/models/index');
const dbHelpers = require('../db-controllers');

const { Op } = db;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../react-client/dist`));
app.use(morgan('dev'));


//
// ─── AUTHENTICAITON MIDDLEWARE ──────────────────────────────────────────────────
//
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
auth.passportHelper(passport);
app.use(flash());


//
// ─── GOOGLE OAUTH ENDPOINTS ─────────────────────────────────────────────────────
//
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'],
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);


//
// ─── LOCAL AUTH ENDPOINTS ───────────────────────────────────────────────────────
//
app.get('/checklogin', (req, res) => {
  res.status(200).send(req.session.passport);
});

app.post('/subscribe', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureFlash: true,
}), (req, res) => {
  res.status(200).send(req.session.passport);
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureFlash: true,
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


//
// ─── USER SEARCH AND INVITE ─────────────────────────────────────────────────────
//
app.post('/searchUsers', (req, res) => {
  console.log(req.body.query);
  db.models.User.findAll({
    limit: 5,
    where: {
      email: {
        [Op.regexp]: req.body.query,
      },
    },
  })
    .then(matches => res.status(200).send(matches))
    .catch(err => res.status(200).send(err));
});


//
// ─── SERVE EMAILS ───────────────────────────────────────────────────────────────
//
app.post('/api/email', (req, res) => {
  console.log('Received request to send email to', req.body.email);
  const { email, id } = req.body;
  const emailData = {
    FromEmail: 'foodfightHR@gmail.com',
    FromName: 'Food Fight',
    Subject: 'You\'ve been invited to a Food Fight!',
    'Text-part': `You've been invited to a new Food Fight. Visit ${process.env.DOMAIN || 'http://localhost:3000/'}rooms/${id} to begin.`,
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


//
// ─── API LOGIC ──────────────────────────────────────────────────────────────────
//
app.post('/api/save', (req, res) => {
  const { id, members } = req.body;
  dbHelpers.saveRoomAndMembers(id, members, (err, room, users) => {
    if (err) {
      console.log('Error saving room and members', err);
    } else {
      console.log('Room and members saved!', room, users);
      res.end(`Room ${id} saved`);
    }
  });
});

app.post('/api/roomInfo', (req, res) => {
  const { roomID } = req.body;
  dbHelpers.getRoomMembers(roomID, (err, roomMembers) => {
    if (err) {
      console.log('Error getting room members', err);
    } else {
      console.log('Room members fetched!', roomMembers);
      res.send(roomMembers);
    }
  });
});

app.post('/api/search', (req, res) => {
  console.log('Received request for Yelp search of', req.body);
  const { zip } = req.body;
  // TO DO: Store the zip code in the database (may be incorporated into /api/save request
  // depending on how the front end is structured)
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
// ────────────────────────────────────────────────────────────────────────────────


// Sets up default case so that any URL not handled by the Express Router
// will be handled by the React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../react-client/dist/index.html`));
});

// create the tables based on the models and once done, listen on the given port
db.models.sequelize.sync().then(() => {
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port', process.env.PORT || 3000);
  });

  const io = socket(server);
  io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('chat', (data) => {
      console.log('Received chat!', data);
      io.sockets.emit('chat', data);
    })
  })
});
