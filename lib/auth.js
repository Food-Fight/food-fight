const passport = require('passport');
const db = require('../database-postgresql/models/index');
const dbHelpers = require('../db-controllers/index');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const email = require('./nodemailerHelpers');


//
// ─── LOCAL STRATEGY ─────────────────────────────────────────────────────────────
//
exports.passportHelper = () => {
  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    ((req, username, password, done) => {
      console.log('REQUEST', req.body);
      // Only create new user if the email hasn't been used
      db.models.User.findOne({ where: { email: username } })
        .then((foundUser) => {
          if (!foundUser) {
            dbHelpers.saveMember(username, password, req.body.zip, (userToSave) => {
              done(null, userToSave.dataValues);
            });
            // Send email indicating successful registration
            const options = email.signupOptions(username);
            email.sendMail(options);
          } else {
            done('error');
          }
        });
    }),
  ));

  passport.use('local-login', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    ((req, username, password, done) => {
      db.models.User.findOne({ where: { email: username } })
        .then((user) => {
          if (user) {
            bcrypt.compare(password, user.dataValues.password)
              .then((valid) => {
                console.log('VALID PASSWORD', valid);
                if (valid) {
                  done(null, user.dataValues);
                }
              })
              .catch(console.log);
          }
        });
    }),
  ));


  //
  // ─── GOOGLE STRATEGY ────────────────────────────────────────────────────────────
  //
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    ((accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      // Only add user if email is unregistered
      db.models.User.findOne({ where: { email } })
        .then((foundUser) => {
          if (!foundUser) {
            dbHelpers.saveMember(email, null, 78702, (userToSave) => {
              done(null, userToSave.dataValues);
            });
            // Send email indicating successful registration
            const options = email.signupOptions(email);
            email.sendMail(options);
          } else {
            done(null, foundUser);
          }
        });
    }),
  ));

  passport.serializeUser((user, done) => {
    console.log('SERIALIZE USER\n');
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    console.log('DESERIALIZE USER\n');
    done(null, obj);
  });
};

