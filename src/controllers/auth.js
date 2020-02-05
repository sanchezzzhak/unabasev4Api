import User from "../models/user";
import jwt from "jsonwebtoken";
import gauth from "../config/auth";
import axios from "axios";
import mailer from "../lib/mailer_deprecated";
import { send } from "../config/mailer";
import template from "../lib/mails";
import { linkMovement } from "./movement";

import envar from "../lib/envar";
import UserPermission from "../models/userPermission";
import { getUserData } from "../lib/user";
import { getLocationByIp } from "../lib/location";
import Currency from "../models/currency";
export const google = (req, res, next) => {
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
      console.log("data google");
      console.log(data.data);
      let query = {
        $or: [
          {
            "google.id": data.data.sub
          },
          {
            "google.email": data.data.email
          }
        ]
      };
      User.findOne(
        query,
        "isActive security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts",
        async (err, user) => {
          if (err) {
            res.status(404).end();
          } else if (!user) {
            const location = await getLocationByIp(req);
            const currency = await Currency.findOne({ countryOrigin: location.data.country.toLowerCase() }).exec();
            let newUser = new User();
            newUser.currency = currency._id.toString();
            (newUser.google = newUser.username = req.body.google.email.slice(0, req.body.google.email.indexOf("@"))), (newUser.google = req.body.google);
            newUser.google.id = data.data.sub;
            newUser.emails = [];
            newUser.imgUrl = req.body.google.imgUrl;
            newUser.emails.push({
              email: req.body.google.email,
              label: "google"
            });
            newUser.name = req.body.google.name;
            newUser.save((err, user) => {
              if (err) {
                res.status(500).end();
              } else {
                linkMovement(user.emails.google, user);
                user.activeScope = user._id;
                user.save((err, userFound) => {
                  const token = jwt.sign(
                    {
                      user: userFound
                    },
                    envar().SECRET,
                    {
                      expiresIn: "3d"
                    }
                  );
                  req.user = user;
                  res.send({
                    token,
                    user: userFound
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

            user.google.id = data.data.sub;
            user.lastLogin = Date.now();
            user.save();
            const token = jwt.sign(
              {
                user: getUserData(user)
              },
              envar().SECRET
            );
            // res.cookie('access_token', token);
            user.populate(
              [
                {
                  path: "currency"
                },
                {
                  path: "scope.id"
                }
              ],
              err => {
                let getUser = getUserData(user);
                let userData = {
                  ...getUser,
                  currency: user.currency
                };
                res.json({
                  token,
                  user: userData
                });
              }
            );
          }
        }
      );
    })
    .catch(err => {
      return next(err);
    });
};

export const password = (req, res, next) => {
  const { newPassword } = req.body;
  console.log("enter restart password");
  User.findById(
    req.params.id,
    "isActive security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts",
    function(err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.statusMessage = req.lg.user.notFound;
        res.statusText = req.lg.user.notFound;
        res.status(404).send({
          err: req.lg.user.notFound
        });
      } else {
        user.security.hash = user.generateHash(newPassword);

        const isActive = user.isActive;
        if (isActive) {
          user.lastLogin = Date.now();
          if (user.activeScope == "" || !user.activeScope || user.activeScope == null) {
            user.activeScope = user._id;
          }
          user.save((err, user) => {
            const token = jwt.sign(
              {
                user
              },
              envar().SECRET,
              {
                expiresIn: "3d"
              }
            );
            req.user = user;
            res.statusMessage = req.lg.user.successLogin;
            res.json({
              token,
              user
            });
          });
        } else if (!isActive) {
          res.statusMessage = req.lg.user.notActive;
          res.status(401).send({
            err: req.lg.user.notActive
          });
        }
      }
    }
  );
};
export const login = (req, res, next) => {
  let query = {
    $or: [
      {
        username: req.body.username
      },
      {
        "emails.email": req.body.username
      }
    ],
    type: "personal"
  };
  User.findOne(query)
    .populate("scope.id")
    .populate("currency")
    .exec((err, user) => {
      // if there are any errors, return the error before anything else
      if (err) return next(err);

      // if no user is found, return the message
      if (!user) {
        res.statusMessage = req.lg.user.notFound;
        res.statusText = req.lg.user.notFound;
        console.log(req.lg.user.notFound);
        console.log(req.lg.user.notFound);
        res.status(404).send({
          err: req.lg.user.notFound
        });
      } else {
        console.log("-------- user compare");
        // console.log(JSON.stringify(getUserData(user)) == JSON.stringify(getUserData(user)));
        const isValid = typeof req.body.password !== "undefined" ? user.validPassword(req.body.password) : false;
        const isActive = user.isActive;
        if (isValid && isActive) {
          user.lastLogin = Date.now();
          if (user.activeScope == "" || !user.activeScope || user.activeScope == null) {
            user.activeScope = user._id;
          }
          user.save(async (err, user) => {
            const token = jwt.sign(
              {
                user
              },
              envar().SECRET,
              {
                expiresIn: "3d"
              }
            );
            req.user = user;
            res.statusMessage = req.lg.user.successLogin;
            if (user.scope.type === "business") {
              // let permissions = await UserPermission.find({ business: user.scope.id, user: user._id }).exec();
              // user.permissions = permissions;
              // try {
              //   let userPermissions = await UserPermission.find({ user: user._id, business: user.scope.id })
              //     .select("permission")
              //     .populate("permission")
              //     .exec();
              //   let permissions = userPermissions.map(userPermission => userPermission.permission);
              //   let result = getUserData(user);
              //   result.permissions = permissions;
              //   res.json({ token, user: result });
              // } catch (err) {
              //   return next(err);
              // }
            }
            res.json({
              token,
              user
            });
          });
        } else if (!isValid) {
          res.statusMessage = req.lg.user.wrongPassword;
          res.status(403).send({
            err: req.lg.user.wrongPassword
          });
        } else if (!isActive) {
          res.statusMessage = req.lg.user.notActive;
          res.status(401).send({
            err: req.lg.user.notActive
          });
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
        //     const token = jwt.sign({ user: getUserData(user) }, mainConfig.mSecret, {
        //       expiresIn: '3d'
        //     });
        //     // res.cookie('access_token', token, {
        //     //   maxAge: 3600 * 24,
        //     //   httpOnly: true
        //     // });
        //     // req.session.user = user;
        //     req.user = user;
        //     res.statusMessage = 'authenticated';
        //     res.json({ token, user: getUserData(user) });
        //   });
      }
    });
};
export const verify = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else if (user) {
      if (user.security.activateHash === req.body.hash) {
        user.isActive = true;
        res.statusMessage = req.lg.user.verified;

        user.save((err, user) => {
          const token = jwt.sign(
            {
              user
            },
            envar().SECRET,
            {
              expiresIn: "3d"
            }
          );
          req.user = user;
          res.json({
            token,
            user
          });
        });
      } else {
        res.statusMessage = req.lg.user.notVerified;
        res.status(404).end();
      }
    } else {
      res.statusMessage = req.lg.user.notFound;
      res.status(404).end();
    }
  });
};
export const register = (req, res, next) => {
  let query = {
    $or: [
      {
        username: req.body.username
      },
      {
        "emails.email": req.body.email
      }
    ]
  };
  User.findOne(query, async function(err, user) {
    // if there are any errors, return the error
    if (err) return next(err);

    // check to see if theres already a user with that email
    if (user) {
      // return done(null, false, req.flash('signupMessage', 'El nombre de usuario ya fue elegido.'));
      res.statusMessage = "Username already exist";
      res.status(409);
      let msg;
      if (user.username === req.body.username) {
        msg = "Username already exist";
      } else {
        msg = "email already registered";
      }
      res.send({
        msg
      });
    } else {
      // if there is no user with that email
      // create the user
      let newUser = new User();

      const location = await getLocationByIp(req);
      const currency = await Currency.findOne({ countryOrigin: location.data.country.toLowerCase() }).exec();

      newUser.currency = currency._id.toString();
      let password;
      let activateHash;
      console.log(req.body.password);

      if (typeof req.body.password === "undefined" || req.body.password === null) {
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

        newUser.password = newUser.generateHash(password);
        newUser.security.updatedAt = new Date();
        newUser.security.isRandom = true;
        newUser.security.activateHash = activateHash;
        newUser.isActive = false;
      } else {
        newUser.password = newUser.generateHash(req.body.password);
        newUser.security.updatedAt = new Date();
        newUser.security.isRandom = false;
        newUser.isActive = true;
      }
      // set the user's local credentials
      newUser.username = req.body.username || req.body.email.slice(0, req.body.email.indexOf("@"));
      // newUser.password = newUser.generateHash(req.body.password);
      // newUser.security.updatedAt = new Date();
      newUser.name = req.body.name;
      // newUser.rut = req.body.rut;
      // newUser.phone = req.body.phone;
      // newUser.cellphone = req.body.cellphone;
      // newUser.emails = {};
      newUser.emails.push({
        email: req.body.email,
        label: "default"
      });
      // newUser.address = req.body.address;

      // save the user
      newUser.save(function(err, user) {
        if (err) throw err;

        const token = jwt.sign(
          {
            user
          },
          envar().SECRET,
          {
            expiresIn: "3d"
          }
        );
        user.activeScope = user._id;
        user.save();
        if (user.security.isRandom) {
          const { text, subject } = template().register({
            password,
            origin: req.headers.origin,
            lang: req.locale.language,
            activateHash,
            id: user._id,
            name: req.body.name
          });
          console.log("text");
          console.log(text);

          let msg = {
            to: req.body.email,
            subject: subject,
            html: text
          };

          send(msg)
            .then(res => console.log(res))
            .catch(err => console.warn(err));
        }
        req.user = user;
        res.json({
          token,
          user
        });
      });
    }
  });
};
export const googleCallback = (req, res, next) => {
  // Successful authentication, redirect home.
  // req.session.access_token = req.user.accessToken;
  // req.session.access_token = req.user.google.accessToken;
  logger("callbackg");
  if (typeof req.user.history.emailUrl != "undefined") {
    let url = req.user.history.emailUrl;
    let update = {
      $unset: {
        "history.emailUrl": ""
      }
    };
    User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      update,
      {},
      (err, user) => {
        if (err) log(err);
        log("user.username");
        log(user.username);
      }
    );
    res.redirect(url);
  } else if (typeof req.user.history.inviteUrl != "undefined") {
    let url = req.user.history.inviteUrl;
    let update = {
      $unset: {
        "history.inviteUrl": ""
      }
    };
    User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      update,
      {},
      (err, user) => {
        if (err) log(err);
        log("user.username");
        log(user.username);
      }
    );
    res.redirect(url);
  } else {
    // res.redirect(mainConfig.web);
    res.send(req);
  }
};
export const errUser = (req, res, next) => {
  logger(req);
};
