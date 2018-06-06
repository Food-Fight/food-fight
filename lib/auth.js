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
      console.log('AUTHENTICATION ROUTE', username, password);
      dbHelpers.saveMember(username, password, 78702, (user) => {
        done(null, user.dataValues);
      });
      // Send email indicating successful registration
      const options = email.signupOptions(username);
      email.sendMail(options);
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
      dbHelpers.saveMember(profile.emails[0].value, null, 78702, (user) => {
        done(null, user.dataValues);
      });
      // Send email indicating successful registration
      const options = email.signupOptions(profile.emails[0].value);
      email.sendMail(options);
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

