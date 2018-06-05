const passport = require('passport');
const db = require('../database-postgresql/index');
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
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    ((req, username, password, done) => {
      db.saveNewUser(req.query.email, username, password, (user) => {
        done(null, user);
      });
      // Send email indicating successful registration
      const options = email.signupOptions(req.query.email);
      email.sendMail(options);
    }),
  ));

  passport.use('local-login', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    ((req, username, password, done) => {
      db.User.find({ username })
        .then((user) => {
          if (user.length) {
            bcrypt.compare(password, user[0].password)
              .then((valid) => {
                if (valid) {
                  done(null, user);
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
      db.saveNewUser(profile.displayName, null, (user) => {
        done(null, user);
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

