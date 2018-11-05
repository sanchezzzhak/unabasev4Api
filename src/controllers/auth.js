import User from '../models/user';
import jwt from 'jsonwebtoken';
import mainConfig from '../config/main';
import logger from '../config/lib/logger';
import gauth from '../config/auth';
import axios from 'axios';
import mailer from '../lib/mailer';
import template from '../lib/mails';
export default {
  login(req, res) {
    let query = {
      $or: [
        { username: req.body.username },
        { 'emails.email': req.body.username }
      ]
    };
    User.findOne(query, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err) {
        console.log(err);
        res.statusMessage = req.lg.error.server;
        res.status(500).end({ err });
      }

      // if no user is found, return the message
      if (!user) {
        res.statusMessage = req.lg.user.notFound;
        res.status(404).end();
      } else {
        const isValid =
          typeof req.body.password.hash !== 'undefined'
            ? user.validPassword(req.body.password.hash)
            : false;
        const isActive = user.isActive;
        if (isValid && isActive) {
          user.lastLogin = Date.now();
          if (
            user.activeScope == '' ||
            !user.activeScope ||
            user.activeScope == null
          ) {
            user.activeScope = user._id;
          }
          user.save((err, user) => {
            const token = jwt.sign(
              { user: user.getUser() },
              mainConfig.mSecret,
              {
                expiresIn: '3d'
              }
            );
            req.user = user;
            res.statusMessage = req.lg.user.successLogin;
            res.json({ token, user: user.getUser() });
          });
        } else if (!isValid) {
          res.statusMessage = req.lg.user.wrongPassword;
          res.status(403).end();
        } else if (!isActive) {
          res.statusMessage = req.lg.user.notActive;
          res.status(401).end();
        }
        //   // res.statusMessage = 'Current password does not match';
        //   // res.status(403).send({ msg: req.lg.user.wrongPassword });

        //   // res.send('Current password does not match');
        //   // return done(null, false, 'wrong pass123sg'); // create the loginMessage and save it to session as flashdata
        // } else if (!user.isActive) {
        //   logger('User is not active');
        //   // res.statusMessage = 'User is not active';
        //   // res.status(401).send({ msg: req.lg.user.notActive });

        //   // res.send('User is not active');
        // } else {
        //   // all is well, return successful user
        //   user.lastLogin = Date.now();
        //   if (
        //     user.activeScope == '' ||
        //     !user.activeScope ||
        //     user.activeScope == null
        //   ) {
        //     user.activeScope = user._id;
        //   }
        //   user.save((err, user) => {
        //     const token = jwt.sign({ user: user.getUser() }, mainConfig.mSecret, {
        //       expiresIn: '3d'
        //     });
        //     // res.cookie('access_token', token, {
        //     //   maxAge: 3600 * 24,
        //     //   httpOnly: true
        //     // });
        //     // req.session.user = user;
        //     req.user = user;
        //     res.statusMessage = 'authenticated';
        //     res.json({ token, user: user.getUser() });
        //   });
      }
    });
  },
  verify: (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (user) {
        if (user.password.activateHash === req.body.hash) {
          user.isActive = true;
          user.save();
          res.statusMessage = req.lg.user.verified;
          res.send({ msg: 'user verified1', user: user.getUser() });
        } else {
          res.statusMessage = req.lg.user.notVerified;
          res.status(404).end();
        }
      } else {
        res.statusMessage = req.lg.user.notFound;
        res.status(404).end();
      }
    });
  },
  register(req, res) {
    logger('reg');
    let query = {
      $or: [{ username: req.body.username }, { 'emails.email': req.body.email }]
    };
    User.findOne(query, function(err, user) {
      // if there are any errors, return the error
      if (err) {
        res.status(500).end();
      }

      // check to see if theres already a user with that email
      if (user) {
        // return done(null, false, req.flash('signupMessage', 'El nombre de usuario ya fue elegido.'));
        res.statusMessage = 'Username already exist';
        res.status(409);
        let msg;
        if (user.username === req.body.username) {
          msg = 'Username already exist';
        } else {
          msg = 'email already registered';
        }
        res.send({
          msg
        });
      } else {
        // if there is no user with that email
        // create the user
        let newUser = new User();

        let password;
        let activateHash;
        console.log(req.body.password);

        if (
          typeof req.body.password === 'undefined' ||
          req.body.password === null
        ) {
          password = Math.random()
            .toString(36)
            .substring(2, 15);
          activateHash =
            Math.random()
              .toString(36)
              .substring(2, 15) +
            Math.random()
              .toString(36)
              .substring(2, 15);

          newUser.password.hash = newUser.generateHash(password);
          newUser.password.updatedAt = new Date();
          newUser.password.isRandom = true;
          newUser.password.activateHash = activateHash;
          newUser.isActive = false;
        } else {
          newUser.password.hash = newUser.generateHash(req.body.password.hash);
          newUser.password.updatedAt = new Date();
          newUser.password.isRandom = false;
          newUser.isActive = true;
        }
        // set the user's local credentials
        newUser.username =
          req.body.username ||
          req.body.email.slice(0, req.body.email.indexOf('@'));
        // newUser.password.hash = newUser.generateHash(req.body.password);
        // newUser.password.updatedAt = new Date();
        newUser.name = req.body.name;
        // newUser.rut = req.body.rut;
        // newUser.phone = req.body.phone;
        // newUser.cellphone = req.body.cellphone;
        // newUser.emails = {};
        newUser.emails.push({
          email: req.body.email,
          label: 'default'
        });
        // newUser.address = req.body.address;

        // save the user
        newUser.save(function(err, user) {
          if (err) throw err;

          const token = jwt.sign({ user: user.getUser() }, mainConfig.mSecret, {
            expiresIn: '3d'
          });
          user.activeScope = user._id;
          user.save();
          if (user.password.isRandom) {
            const text = template().register({
              password,
              origin: req.headers.origin,
              activateHash,
              id: user._id
            });
            let msg = {
              to: req.body.email,
              subject: `Hola! ${req.body.name} bienvenido a Unabase!`,
              html: text
            };

            mailer(msg);
          }
          req.user = user;
          res.json({ token, user: user.getUser() });
        });
      }
    });
  },
  googleCallback(req, res) {
    // Successful authentication, redirect home.
    // req.session.access_token = req.user.accessToken;
    // req.session.access_token = req.user.google.accessToken;
    logger('callbackg');
    if (typeof req.user.history.emailUrl != 'undefined') {
      let url = req.user.history.emailUrl;
      let update = {
        $unset: {
          'history.emailUrl': ''
        }
      };
      User.findOneAndUpdate({ _id: req.user._id }, update, {}, (err, user) => {
        if (err) log(err);
        log('user.username');
        log(user.username);
      });
      res.redirect(url);
    } else if (typeof req.user.history.inviteUrl != 'undefined') {
      let url = req.user.history.inviteUrl;
      let update = {
        $unset: {
          'history.inviteUrl': ''
        }
      };
      User.findOneAndUpdate({ _id: req.user._id }, update, {}, (err, user) => {
        if (err) log(err);
        log('user.username');
        log(user.username);
      });
      res.redirect(url);
    } else {
      // res.redirect(mainConfig.web);
      res.send(req);
    }
  },
  errUser(req, res) {
    logger(req);
  },
  google: (req, res) => {
    let url = gauth.googleAuth.endpoint + req.body.token;

    console.log(req.body);
    console.log(url);

    axios(url)
      .then(data => {
        // logger('data from gauth');
        // logger(data['sub']);
        // logger({
        //   'google.id': data.data.sub
        // });
        User.findOne(
          {
            'google.id': data.data.sub
          },
          (err, user) => {
            if (err) {
              res.status(404).end();
            } else if (!user) {
              let newUser = new User();

              (newUser.username = req.body.google.email.slice(
                0,
                req.body.google.email.indexOf('@')
              )),
                (newUser.google = req.body.google);
              newUser.emails = [];
              newUser.emails.push({
                email: req.body.google.email,
                label: 'google'
              });
              newUser.name = req.body.google.name;
              newUser.save((err, user) => {
                if (err) {
                  res.status(500).end();
                } else {
                  user.activeScope = user._id;
                  user.save((err, userFound) => {
                    const token = jwt.sign(
                      { user: user.getUser() },
                      mainConfig.mSecret,
                      {
                        expiresIn: '3d'
                      }
                    );
                    req.user = user;
                    res.send({
                      token,
                      user: userFound.getUser()
                    });

                    // res.json({
                    //   message: "User Authenticated",
                    //   token
                    // });
                  });
                }
              });
            } else {
              // logger('user.google');
              // logger(user);
              const token = jwt.sign(
                { user: user.getUser() },
                mainConfig.mSecret
              );
              // res.cookie('access_token', token);
              res.json({ token, user: user.getUser() });
            }
          }
        );
      })
      .catch(err => {
        // logger(err);
        res.status(503).end();
      });
  }

  // {
  //   register: (req, res) => {
  //     User.findOne({ 'google.id': req.body.id }, (err, user) => {
  //       if (err) {
  //         res.status(500).end();
  //       } else {
  //         if (user) {
  //           res.send(user);
  //         } else {
  //           let newUser = new User();

  //           (newUser.username = req.body.email.slice(
  //             0,
  //             req.body.email.indexOf('@')
  //           )),
  //             (newUser.google = req.body);
  //           newUser.emails = {
  //             google: req.body.email
  //           };
  //           newUser.name = req.body.name;
  //           newUser.save((err, user) => {
  //             if (err) {
  //               res.status(500).end();
  //             } else {
  //               user.activeScope = user._id;
  //               user.save((err, userFound) => {
  //                 const token = jwt.sign(
  //                   { user: user.getUser() },
  //                   mainConfig.mSecret,
  //                   {
  //                     expiresIn: '3d'
  //                   }
  //                 );
  //                 req.user = user;
  //                 res.send({
  //                   token,
  //                   user: userFound.getUser()
  //                 });

  //                 // res.json({
  //                 //   message: "User Authenticated",
  //                 //   token
  //                 // });
  //               });
  //             }
  //           });
  //         }
  //       }
  //     });
  //   },
  //   login: (req, res) => {
  //     let url = gauth.googleAuth.endpoint + req.body.google.token;

  //     console.log(req.body);

  //     axios(url)
  //       .then(data => {
  //         // logger('data from gauth');
  //         // logger(data['sub']);
  //         // logger({
  //         //   'google.id': data.data.sub
  //         // });
  //         User.findOne(
  //           {
  //             'google.id': data.data.sub
  //           },
  //           (err, user) => {
  //             if (err) {
  //               res.status(404).end();
  //             } else if (!user) {
  //               let newUser = new User();

  //               (newUser.username = req.body.google.email.slice(
  //                 0,
  //                 req.body.google.email.indexOf('@')
  //               )),
  //                 (newUser.google = req.body.google);
  //               newUser.emails = {
  //                 google: req.body.google.email
  //               };
  //               newUser.name = req.body.google.name;
  //               newUser.save((err, user) => {
  //                 if (err) {
  //                   res.status(500).end();
  //                 } else {
  //                   user.activeScope = user._id;
  //                   user.save((err, userFound) => {
  //                     const token = jwt.sign(
  //                       { user: user.getUser() },
  //                       mainConfig.mSecret,
  //                       {
  //                         expiresIn: '3d'
  //                       }
  //                     );
  //                     req.user = user;
  //                     res.send({
  //                       token,
  //                       user: userFound.getUser()
  //                     });

  //                     // res.json({
  //                     //   message: "User Authenticated",
  //                     //   token
  //                     // });
  //                   });
  //                 }
  //               });
  //             } else {
  //               // logger('user.google');
  //               // logger(user);
  //               const token = jwt.sign(
  //                 { user: user.getUser() },
  //                 mainConfig.mSecret
  //               );
  //               // res.cookie('access_token', token);
  //               res.json({ token, user: user.getUser() });
  //             }
  //           }
  //         );
  //       })
  //       .catch(err => {
  //         // logger(err);
  //         res.status(503).end();
  //       });
  //   }
  // }
};
