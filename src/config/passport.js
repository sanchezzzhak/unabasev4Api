// config/passport.js

// load all the things we need
// const LocalStrategy = require('passport-local').Strategy;
import { LocalStrategy } from 'passport-local';
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import { GoogleStrategy } from 'passport-google-oauth';

// load up the user model
// const User = require('../models/user');
import User from '../models/user';
// const mainConfig = require('./main.js');

// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// const mConfig = require('./main');
import mConfig from './main';
// load the auth variables
// const configAuth = require('./auth');
import configAuth from './auth';

let setGoogle = (google, newUser) => {
  let email = google.emails[0].value;
  (newUser.username = email.slice(0, email.indexOf('@'))),
    (newUser.name = google.displayName),
    (newUser.google.id = google.id),
    (newUser.google.name = google.displayName),
    (newUser.google.email = email),
    (newUser.google.accessToken = accessToken),
    (newUser.google.imgUrl = google.photos[0].value);
  newUser.save(function(err, user) {
    if (err) throw err;

    user.activeScope = user._id;
    user.save();
    return done(null, newUser);
  });
};

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ username: username }, function(err, user) {
            // if there are any errors, return the error
            if (err) return done(err);

            // check to see if theres already a user with that email
            if (user) {
              return done(
                null,
                false,
                req.flash(
                  'signupMessage',
                  'El nombre de usuario ya fue elegido.'
                )
              );
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.username = username;
              newUser.password = newUser.generateHash(password);
              newUser.isActive = true;
              newUser.name = req.body.name;
              newUser.rut = req.body.rut;
              newUser.telefono = req.body.telefono;
              newUser.celular = req.body.celular;
              newUser.email = req.body.email;
              newUser.address = req.body.address;

              // save the user
              newUser.save(function(err, user) {
                if (err) throw err;

                user.activeScope = user._id;
                user.save();
                req.flash('success_msg', 'Usuario creado');
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with username
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        // callback with username and password from our form
        // console.log(username)
        // console.log(password)
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ username: username }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err) return done(err);

          // if no user is found, return the message
          if (!user) {
            console.log('no user');
            return done(null, false, {
              code: 404,
              msg: 'User does not exist',
              url: 'nouser'
            }); // req.flash is the way to set flashdata using connect-flash
          }
          // if the user is found but the password is wrong
          if (!user.validPassword(password)) {
            console.log('Current password does not match');

            return done(null, false, {
              code: 403,
              msg: 'Current password does not match',
              url: 'wrong'
            }); // create the loginMessage and save it to session as flashdata
          }
          if (!user.isActive) {
            console.log('innactive');
            return done(null, false, {
              code: 401,
              msg: 'User is not active',
              url: 'inactive'
            }); //
          }

          // all is well, return successful user
          user.last_login = Date.now();
          console.log('desde passport login------------');
          console.log(typeof user.activeScope);
          console.log(user.activeScope);
          if (
            user.activeScope == '' ||
            !user.activeScope ||
            user.activeScope == null
          ) {
            user.activeScope = user._id;
          }
          user.save();
          return done(null, user);
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        // clientID: '911992056725-uno0u77p6vc770gnv30jmr9t7bl6hhk8.apps.googleusercontent.com',
        // clientSecret: '9G3x5hZlNJz4RbMsU0Zmn9Ar',
        // callbackURL: "http://unav4.unabase.cl/auth/google/callback",
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          console.log('//////////////////////////////');
          console.log(configAuth.googleAuth.callbackURL);
          console.log(req.user);
          if (!req.user) {
            console.log('no hay usuario activo');
            User.findOne({ 'google.id': profile.id }, function(err, user) {
              if (err) {
                console.log(err);
                return done(err);
              }

              if (user) {
                if (user.username == '') {
                  user.username = user.google.email.slice(
                    0,
                    user.google.email.indexOf('@')
                  );
                  if (user.name == '') {
                    user.name = user.google.name;
                  }
                  user.save();
                }
                console.log('consiguio un usuario google en db');
                // return done(null, user);

                const token = jwt.sign(
                  { user: user.getUser() },
                  mConfig.mSecret,
                  { expiresIn: '3d' }
                );
                return done(null, user);
                // res.json({
                //   message: "User Authenticated",
                //   token
                // });
              } else {
                console.log('no consiguio un usuario google en db');
                User.findOne(
                  { email: profile.emails[0].value },
                  (err, user) => {
                    if (err) {
                      console.log(err);
                      return done(err);
                    }

                    if (user) {
                      let email = profile.emails[0].value;
                      (user.username = email.slice(0, email.indexOf('@'))),
                        (user.name = profile.displayName),
                        (user.google.id = profile.id),
                        (user.google.name = profile.displayName),
                        (user.google.email = email),
                        (user.google.accessToken = accessToken),
                        (user.google.imgUrl = profile.photos[0].value);
                      user.save(function(err, user) {
                        if (err) throw err;

                        user.activeScope = user._id;
                        user.save((err, userFound) => {
                          const token = jwt.sign(
                            { user: userFound.getUser() },
                            mConfig.mSecret,
                            { expiresIn: '3d' }
                          );

                          // res.json({
                          //   message: "User Authenticated",
                          //   token
                          // });
                        });
                        return done(null, user);
                      });
                    } else {
                      let newUser = new User();
                      let email = profile.emails[0].value;
                      (newUser.username = email.slice(0, email.indexOf('@'))),
                        (newUser.name = profile.displayName),
                        (newUser.google.id = profile.id),
                        (newUser.google.name = profile.displayName),
                        (newUser.google.email = email),
                        (newUser.google.accessToken = accessToken),
                        (newUser.google.imgUrl = profile.photos[0].value);
                      newUser.save(function(err, user) {
                        if (err) throw err;

                        user.activeScope = user._id;
                        user.save((err, userFound) => {
                          const token = jwt.sign(
                            { user: userFound.getUser() },
                            mConfig.mSecret,
                            { expiresIn: '3d' }
                          );

                          // res.json({
                          //   message: "User Authenticated",
                          //   token
                          // });
                        });
                        return done(null, newUser);
                      });
                    }
                  }
                );
              }
            });
          } else {
            User.findOne({ 'google.id': profile.id }, function(err, user) {
              if (err) {
                console.log(err);
                return done(err);
              }

              if (user) {
                console.log('consiguio un usuario google en db ya asociada');
                return done(null, user);

                // res.json({
                //   message: "User already connected"
                // });
                // return done(null, null, {info: 'cuenta google ya asociada'});
              } else {
                var user = req.user; // pull the user out of the session
                if (user.name == '') {
                  user.name = profile.displayName;
                }

                (user.google.id = profile.id),
                  (user.google.name = profile.displayName),
                  (user.google.email = profile.emails[0].value),
                  (user.google.accessToken = accessToken),
                  (user.google.imgUrl = profile.photos[0].value);
                // save the user
                user.save(function(err, userFound) {
                  if (err) throw err;

                  const token = jwt.sign(
                    { user: userFound.getUser() },
                    mConfig.mSecret,
                    { expiresIn: '3d' }
                  );

                  // res.json({
                  //   message: "User Authenticated",
                  //   token
                  // });
                  // console.log("desde passport, user");
                  // console.log(user);
                  return done(null, user);
                });
              }
            });
          }
        });
      }
    )
  );
};
