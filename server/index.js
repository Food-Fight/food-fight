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

app.use((req, res, next) => {
  console.log(req.session);
  next();
});


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
  res.status(200).redirect('/');
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
// ─── SERVE EMAIL INVITATIONS ────────────────────────────────────────────────────
//
app.post('/api/signupEmail', (req, res) => {
  console.log('Received request to send email to', req.body.email);
  const { email } = req.body;
  const emailData = {
    FromEmail: 'foodfightHR@gmail.com',
    FromName: 'Food Fight',
    Subject: 'You\'ve been invited to Food Fight!',
    'Text-part': `You've been invited to a Food Fight. Visit ${process.env.DOMAIN || 'http://localhost:3000/'}signup to signup.`,
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

app.post('/api/roomEmail', (req, res) => {
  console.log('Received request to send email to', req.body);
  const { email, roomInfo } = req.body;
  const emailData = {
    FromEmail: 'foodfightHR@gmail.com',
    FromName: 'Food Fight',
    Subject: 'You\'ve been invited to join a Food Fight room!',
    'Text-part': `You've been invited to a Food Fight room. Visit ${process.env.DOMAIN || 'http://localhost:3000/'}rooms/${roomInfo.uniqueid} to join.`,
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
// ─── CREATE ROOMS AND GET ROOM INFO ─────────────────────────────────────────────
//
app.post('/api/save', (req, res) => {
  // console.log('NEW ROOM DATA', req.body);
  const { roomName, zip, members } = req.body;
  dbHelpers.saveRoomAndMembers(roomName, zip, members, (err, room, users) => {
    if (err) {
      console.log('Error saving room and members', err);
    } else {
      // console.log('Room and members saved!', room, users);
      res.send(room[0].dataValues);
    }
  });
});

app.get('/api/rooms/:roomID', (req, res) => {
  const { roomID } = req.params;
  dbHelpers.getRoomMembers(roomID, (err, roomMembers) => {
    if (err) {
      console.log('Error getting room members', err);
    } else {
      // console.log('Room members fetched!', roomMembers);
      res.send(roomMembers);
    }
  });
});

app.post('/room-redirect', (req, res) => {
  console.log(req.body);
  res.redirect(307, `/rooms/${req.body.id}`);
});


//
// ─── EXTERNAL API LOGIC ─────────────────────────────────────────────────────────
//
app.post('/api/search', (req, res) => {
  console.log('Received request for Yelp search of', req.body);
  const { zip } = req.body;
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


//
// ─── HANDLE MESSAGES AND VOTES─────────────────────────────────────────────────────────
//
app.post('/api/messages', (req, res) => {
  const { message, roomID } = req.body;
  // console.log('MESSAGE', message, 'ROOM', roomID);
  dbHelpers.saveMessage(message.name, message.message, roomID, (err, savedMessage) => {
    if (err) {
      console.log('Error saving message', err);
      res.status(404).end();
    } else {
      // console.log(`Message saved`, savedMessage);
      res.end('Message saved', savedMessage);
    }
  });
});

app.get('/api/messages/:roomID', (req, res) => {
  const { roomID } = req.params;
  // console.log('ROOMID', roomID);
  dbHelpers.getMessages(roomID, (err, fetchedMessages) => {
    if (err) {
      console.log('Error retrieving messages', err);
      res.status(404).end();
    } else {
      console.log('Messages retrieved!', fetchedMessages);
      res.send(fetchedMessages);
    }
  });
});

app.post('/api/nominate', (req, res) => {
  const { name, roomID } = req.body;
  dbHelpers.saveRestaurant(name, roomID, (err, restaurant) => {
    if (err) {
      console.log('Error saving restaurant', err);
    } else {
      // console.log('Restaurant saved!', restaurant);
      res.end('Restaurant saved!', restaurant);
    }
  });
});

app.post('/api/votes', (req, res) => {
  const { name, roomID } = req.body;
  dbHelpers.updateVotes(name, roomID, (err, restaurant) => {
    if (err) {
      console.log('Error upvoting restaurant', err);
    } else {
      // console.log('Restaurant updated!', restaurant);
      res.end('Restaurant upvoted!', restaurant);
    }
  });
});

app.post('/api/vetoes', (req, res) => {
  const { name, roomID } = req.body;
  dbHelpers.updateVetoes(name, roomID, (err, restaurant) => {
    if (err) {
      console.log('Error vetoing restaurant', err);
    } else {
      // console.log('Restaurant vetoed!', restaurant);
      res.end('Restaurant vetoed!', restaurant);
    }
  });
});

app.get('/api/votes/:roomID', (req, res) => {
  const { roomID } = req.params;
  dbHelpers.getScoreboard(roomID, (err, scores) => {
    if (err) {
      console.log('Error fetching scoreboard', err);
    } else {
      // console.log('Scoreboard retrieved!', scores);
      res.send(scores);
    }
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
  io.on('connection', (newSocket) => {
    console.log('made socket connection', newSocket.id);

    newSocket.on('chat', (data) => {
      console.log('Received chat!', data);
      io.sockets.emit('chat', data);
    });

    newSocket.on('nominate', (data) => {
      console.log('Nomination received!', data);
      io.sockets.emit('nominate', data);
    });

    newSocket.on('vote', (data) => {
      console.log('Received vote!', data);
      io.sockets.emit('vote', data.roomID);
    });

    newSocket.on('veto', (data) => {
      console.log('Received veto!', data);
      io.sockets.emit('veto', data.roomID);
    });
  });
});
