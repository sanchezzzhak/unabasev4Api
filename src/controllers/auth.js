import User from '../models/user';
import jwt from 'jsonwebtoken';
import mainConfig from '../config/main';
import logger from '../config/lib/logger';
import gauth from '../config/auth';
import axios from 'axios';
export default {
  // if (err) {
  //   return next(err);
  // }
  // if (!user) {
  //   res.statusMessage = info.msg;
  //   res.status(info.code).end();
  //   // return res.redirect(info.code, "/");
  // } else {
  //   req.logIn(user, function(err) {
  //     if (err) {
  //       return next(err);
  //     } else {
  //       const token = jwt.sign({ user: user.getUser() }, mainConfig.mSecret, {
  //         // expiresIn: 60 * 60 * 24 * 7
  //         expiresIn: 60 * 60 * 24 * 7
  //       });
  //       // res.cookie('access_token', token);
  //       res.statusMessage = 'authenticated';
  //       res.json({ token, user: user.getUser() });
  //     }
  //     // return res.redirect("/isAuth");
  //   });
  // }

  login(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err) {
        throw err;
      }

      // if no user is found, return the message
      if (!user) {
        logger('User does not exist');
        res.statusMessage = 'User does not exist';
        res.status(404).end();

        // res.send('User does not exist');
      } else if (!user.validPassword(req.body.password)) {
        logger('Current password does not match');

        res.statusMessage = 'Current password does not match';
        res.status(403).end();

        // res.send('Current password does not match');
        // return done(null, false, 'wrong pass123sg'); // create the loginMessage and save it to session as flashdata
      } else if (!user.isActive) {
        logger('User is not active');
        res.statusMessage = 'User is not active';
        res.status(401).end();

        // res.send('User is not active');
      } else {
        // all is well, return successful user
        user.lastLogin = Date.now();
        if (
          user.activeScope == '' ||
          !user.activeScope ||
          user.activeScope == null
        ) {
          user.activeScope = user._id;
        }
        user.save((err, user) => {
          const token = jwt.sign({ user: user.getUser() }, mConfig.mSecret, {
            expiresIn: '3d'
          });
          // res.cookie('access_token', token, {
          //   maxAge: 3600 * 24,
          //   httpOnly: true
          // });
          // req.session.user = user;
          req.user = user;
          res.statusMessage = 'authenticated';
          res.json({ token, user: user.getUser() });
        });
      }
    });
  },
  register(req, res) {
    logger('reg');
    User.findOne({ username: req.body.username }, function(err, user) {
      // if there are any errors, return the error
      if (err) throw err;

      // check to see if theres already a user with that email
      if (user) {
        // return done(null, false, req.flash('signupMessage', 'El nombre de usuario ya fue elegido.'));
        res.statusMessage = 'Username already exist';
        res.status(404);
        res.send({
          msg: 'Username already exist'
        });
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.username =
          req.body.username ||
          req.body.email.slice(0, req.body.email.indexOf('@'));
        newUser.password = newUser.generateHash(req.body.password);
        // newUser.isActive = true;
        newUser.name = req.body.name;
        // newUser.rut = req.body.rut;
        // newUser.phone = req.body.phone;
        // newUser.cellphone = req.body.cellphone;
        newUser.emails = {};
        newUser.emails.default = req.body.email;
        // newUser.address = req.body.address;

        // save the user
        newUser.save(function(err, user) {
          if (err) throw err;

          const token = jwt.sign({ user: user.getUser() }, mConfig.mSecret, {
            expiresIn: '3d'
          });
          user.activeScope = user._id;
          user.save();
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
      // res.redirect(mConfig.web);
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
              newUser.emails = {
                google: req.body.google.email
              };
              newUser.name = req.body.google.name;
              newUser.save((err, user) => {
                if (err) {
                  res.status(500).end();
                } else {
                  user.activeScope = user._id;
                  user.save((err, userFound) => {
                    const token = jwt.sign(
                      { user: user.getUser() },
                      mConfig.mSecret,
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
  //                   mConfig.mSecret,
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
  //                       mConfig.mSecret,
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