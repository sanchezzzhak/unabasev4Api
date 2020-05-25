import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../models/user";
import jwt from "jsonwebtoken";
import configAuth from "./auth";

// const secret = process.env.SECRET;
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "Incorrect username."
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      return done(null, user);
    });
  })
);

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy({
      // clientID: '911992056725-uno0u77p6vc770gnv30jmr9t7bl6hhk8.apps.googleusercontent.com',
      // clientSecret: '9G3x5hZlNJz4RbMsU0Zmn9Ar',
      // callbackURL: "http://unav4.unabase.cl/auth/google/callback",
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        logy("//////////////////////////////");
        logy(configAuth.googleAuth.callbackURL);
        logy(req.user);
        if (!req.user) {
          logy("no hay usuario activo");
          User.findOne({
            "google.id": profile.id
          }, function (err, user) {
            if (err) {
              logy(err);
              return done(err);
            }

            if (user) {
              if (user.username == "") {
                user.username = user.google.email.slice(0, user.google.email.indexOf("@"));
                if (user.name == "") {
                  user.name = user.google.name;
                }
                user.save();
              }
              logy("consiguio un usuario google en db");
              // return done(null, user);

              const token = jwt.sign({
                user: user.getUser()
              }, process.env.SECRET, {
                expiresIn: "3d"
              });
              return done(null, user);
              // res.json({
              //   message: "User Authenticated",
              //   token
              // });
            } else {
              logy("no consiguio un usuario google en db");
              User.findOne({
                email: profile.emails[0].value
              }, (err, user) => {
                if (err) {
                  logy(err);
                  return done(err);
                }

                if (user) {
                  let email = profile.emails[0].value;
                  (user.username = email.slice(0, email.indexOf("@"))),
                  (user.name = profile.displayName),
                  (user.google.id = profile.id),
                  (user.google.name = profile.displayName),
                  (user.google.email = email),
                  (user.google.accessToken = accessToken),
                  (user.google.imgUrl = profile.photos[0].value);
                  user.save(function (err, user) {
                    if (err) throw err;

                    user.activeScope = user._id;
                    user.save((err, userFound) => {
                      const token = jwt.sign({
                        user: userFound.getUser()
                      }, process.env.SECRET, {
                        expiresIn: "3d"
                      });

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
                  (newUser.username = email.slice(0, email.indexOf("@"))),
                  (newUser.name = profile.displayName),
                  (newUser.google.id = profile.id),
                  (newUser.google.name = profile.displayName),
                  (newUser.google.email = email),
                  (newUser.google.accessToken = accessToken),
                  (newUser.google.imgUrl = profile.photos[0].value);
                  newUser.save(function (err, user) {
                    if (err) throw err;

                    user.activeScope = user._id;
                    user.save((err, userFound) => {
                      const token = jwt.sign({
                        user: userFound.getUser()
                      }, process.env.SECRET, {
                        expiresIn: "3d"
                      });

                      // res.json({
                      //   message: "User Authenticated",
                      //   token
                      // });
                    });
                    return done(null, newUser);
                  });
                }
              });
            }
          });
        } else {
          User.findOne({
            "google.id": profile.id
          }, function (err, user) {
            if (err) {
              logy(err);
              return done(err);
            }

            if (user) {
              logy("consiguio un usuario google en db ya asociada");
              return done(null, user);

              // res.json({
              //   message: "User already connected"
              // });
              // return done(null, null, {info: 'cuenta google ya asociada'});
            } else {
              var user = req.user; // pull the user out of the session
              if (user.name == "") {
                user.name = profile.displayName;
              }

              (user.google.id = profile.id),
              (user.google.name = profile.displayName),
              (user.google.email = profile.emails[0].value),
              (user.google.accessToken = accessToken),
              (user.google.imgUrl = profile.photos[0].value);
              // save the user
              user.save(function (err, userFound) {
                if (err) throw err;

                const token = jwt.sign({
                  user: userFound.getUser()
                }, process.env.SECRET, {
                  expiresIn: "3d"
                });

                // res.json({
                //   message: "User Authenticated",
                //   token
                // });
                // logy("desde passport, user");
                // logy(user);
                return done(null, user);
              });
            }
          });
        }
      });
    }
  )
);