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
import { getUserData, generateToken } from "../lib/user";
import { getLocationByIp } from "../lib/location";
import Currency from "../models/currency";
import { notFoundError, createError, missingData } from "../lib/error";
import { getCurrencyByLocation } from "../lib/currency";
import { language } from "../language";
export const google = (req, res, next) => {
  let url = gauth.googleAuth.endpoint + req.body.token;

  axios(url)
    .then(data => {
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
        "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts",
        async (err, user) => {
          if (err) next(err);
          if (!user) {
            // const location = await getLocationByIp(req);
            // const countryOrigin = location.data.country ? location.data.country.toLowerCase() : "chile";
            // const currency = await Currency.findOne({ countryOrigin }).exec();

            let newUser = new User();
            newUser.currency = await getCurrencyByLocation(req);
            // (newUser.google = newUser.username = req.body.google.email.slice(0, req.body.google.email.indexOf("@"))), (newUser.google = req.body.google);

            newUser.username = req.body.google.email.slice(0, req.body.google.email.indexOf("@"));
            newUser.google = req.body.google;
            newUser.google.id = data.data.sub;
            newUser.emails = [];
            newUser.imgUrl = req.body.google.imgUrl;
            newUser.emails.push({
              email: req.body.google.email,
              label: "google"
            });
            newUser.name = req.body.google.name;
            newUser.save((err, user) => {
              if (err) next(err);
              if (user) {
                // TODO verify link with user after modify the model of client.data to client.user
                // linkMovement(user.emails.google, user);
                user.activeScope = user._id;
                user.save(async (err, userFound) => {
                  if (err) next(err);
                  // const token = jwt.sign(
                  //   {
                  //     user: userFound
                  //   },
                  //   envar().SECRET,
                  //   {
                  //     expiresIn: "3d"
                  //   }
                  // );
                  await user.populate([
                    {
                      path: "scope.id",
                      select: "name"
                    }
                  ]);
                  req.user = userFound;
                  req.user.id = req.user._id.toString() || null;
                  res.send({
                    token: generateToken(userFound),
                    user: userFound
                  });
                });
              }
            });
          } else {
            user.google.id = data.data.sub;
            user.lastLogin = Date.now();
            user.save();
            // const token = jwt.sign(
            //   {
            //     user: getUserData(user)
            //   },
            //   envar().SECRET
            // );
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
                res.send({
                  token: generateToken(getUserData(user)),
                  user
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
  logy("enter restart password");
  User.findById(
    req.params.id,
    "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts",
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
          user.save(async (err, user) => {
            // const token = jwt.sign(
            //   {
            //     user
            //   },
            //   envar().SECRET,
            //   {
            //     expiresIn: "3d"
            //   }
            // );
            await user.populate([
              {
                path: "scope.id",
                select: "name"
              }
            ]);
            req.user = user;
            req.user.id = req.user._id.toString() || null;
            res.statusMessage = req.lg.user.successLogin;
            res.json({
              token: generateToken(user),
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
    .select(
      "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts"
    )
    .populate("scope.id")
    .populate("currency")
    .exec(async (err, user) => {
      // if there are any errors, return the error before anything else
      if (err) return next(err);

      // if no user is found, return the message
      if (!user) next(notFoundError());
      const isValid = typeof req.body.password !== "undefined" ? await User.validPassword(user._id.toString(), req.body.password) : false;
      // const isValid = typeof req.body.password !== "undefined" ? user.validPassword(req.body.password) : false;
      delete user.password;
      if (!isValid) next(createError(403, req.lg.user.wrongPassword));
      if (!user.isActive) next(createError(401, req.lg.user.notActive));
      // if (isValid && user.isActive) {
      user.lastLogin = Date.now();
      if (user.activeScope == "" || !user.activeScope || user.activeScope == null) {
        user.activeScope = user._id;
      }
      user.save(async (err, user) => {
        // const token = jwt.sign(
        //   {
        //     user
        //   },
        //   envar().SECRET,
        //   {
        //     expiresIn: "3d"
        //   }
        // );
        await user.populate([
          {
            path: "scope.id",
            select: "name"
          }
        ]);
        req.user = user;
        req.user.id = req.user._id.toString() || null;
        res.statusMessage = req.lg.user.successLogin;
        delete user.password;
        res.json({
          token: generateToken(user),
          user
        });
      });
      // } else if (!isValid) {
      //   res.statusMessage = req.lg.user.wrongPassword;
      //   res.status(403).send({
      //     err: req.lg.user.wrongPassword
      //   });
      // } else if (!user.isActive) {
      //   res.statusMessage = req.lg.user.notActive;
      //   res.status(401).send({
      //     err: req.lg.user.notActive
      //   });
      // }
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

        user.save(async (err, user) => {
          // const token = jwt.sign(
          //   {
          //     user
          //   },
          //   envar().SECRET,
          //   {
          //     expiresIn: "3d"
          //   }
          // );
          await user.populate([
            {
              path: "scope.id",
              select: "name"
            }
          ]);
          req.user = user;
          req.user.id = req.user._id.toString() || null;
          res.json({
            token: generateToken(user),
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
  if (!req.body.email) next(missingData(req.lg.user.missingEmail));
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
      res.statusMessage = req.lg.user.alreadyExist;
      res.status(409);
      let msg;
      if (user.username === req.body.username) {
        msg = req.lg.user.alreadyExist;
      } else {
        msg = req.lg.user.alreadyRegistered;
      }
      res.send({
        msg
      });
    } else {
      // if there is no user with that email
      // create the user
      let newUser = new User();

      // const location = await getLocationByIp(req);
      // const countryOrigin = location.data.country ? location.data.country.toLowerCase() : "chile";
      // const currency = await Currency.findOne({ countryOrigin }).exec();

      newUser.currency = await getCurrencyByLocation(req);
      let password;
      let activateHash;
      logy(req.body.password);

      // if the user register without password, we generate one random, and ask to verify the account
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
        newUser.security.hasPassword = false;
        newUser.isActive = false;
      } else {
        newUser.password = newUser.generateHash(req.body.password);
        newUser.security.updatedAt = new Date();
        newUser.security.isRandom = false;
        newUser.security.hasPassword = true;
        newUser.isActive = true;
      }
      // set the user's local credentials
      newUser.username = req.body.username || req.body.email.slice(0, req.body.email.indexOf("@"));

      newUser.name = req.body.name;

      newUser.emails.push({
        email: req.body.email,
        label: "default"
      });

      // save the user
      newUser.save(async function(err, user) {
        if (err) throw err;

        // const token = jwt.sign(
        //   {
        //     user
        //   },
        //   envar().SECRET,
        //   {
        //     expiresIn: "3d"
        //   }
        // );
        user.activeScope = user._id;
        user.save();
        // TODO, send email asking to verify account if the password is generated by the system.
        // if (user.security.isRandom) {
        //   const { text, subject } = template().register({
        //     password,
        //     origin: req.headers.origin,
        //     lang: req.locale.language,
        //     activateHash,
        //     id: user._id,
        //     name: req.body.name
        //   });
        //   logy("text");
        //   logy(text);

        //   let msg = {
        //     to: req.body.email,
        //     subject: subject,
        //     html: text
        //   };

        //   send(msg)
        //     .then(res => logy(res))
        //     .catch(err => console.warn(err));
        // }
        await user.populate([
          {
            path: "scope.id",
            select: "name"
          }
        ]);
        req.user = user;
        req.user.id = req.user._id.toString() || null;
        res.json({
          token: generateToken(user),
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
