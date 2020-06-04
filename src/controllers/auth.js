import User from "../models/user";
import jwt from "jsonwebtoken";
import gauth from "../config/auth";
import axios from "axios";
import mailer from "../lib/mailer_deprecated";
import { send } from "../config/mailer";
import template from "../lib/mails";
import Relation from "../models/relation";
import { linkMovement } from "./movement";

import envar from "../lib/envar";
import UserPermission from "../models/userPermission";
import { getUserData, generateToken } from "../lib/user";
import { getLocationByIp } from "../lib/location";
import Currency from "../models/currency";
import { notFoundError, createError, missingData } from "../lib/error";
import { getCurrencyByLocation } from "../lib/currency";
import { language } from "../language";
import { getTokenByRefresh, refreshTokenGen, accessTokenGen } from "../config/lib/auth";

const USER_DATA_SELECT =
  "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts sections";


  export const google = async (req, res, next) => {
  let url = gauth.googleAuth.endpoint + req.body.token;

  axios(url)
    .then(async data => {
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
      let user = await User.findOne(query, USER_DATA_SELECT).populate("sections").populate("currency").populate("scope.id").exec();
      console.log(user);
      if (!user?._id) {
        user = new User();
        user.currency = await getCurrencyByLocation(req);

        user.username = req.body.google.email.slice(0, req.body.google.email.indexOf("@"));
        user.google = req.body.google;
        user.google.id = data.data.sub;
        user.emails = [];
        user.imgUrl = req.body.google.imgUrl;
        user.emails.push({
          email: req.body.google.email,
          label: "google"
        });
        let names = req.body.google.name.split(" ");
        user.name = {
          first: names[0]
        };

        user.middle = names.length > 2 ? names[1] : null;
        user.last = names.length > 2 ? names[2] : names[1];
        user.secondLast = names[3] || null;

        // TODO verify link with user after modify the model of client.data to client.user
        // linkMovement(user.emails.google, user);
        await user.save();

        req.user = user;
        req.user.id = req.user._id.toString() || null;
        res.send({
          access_token: accessTokenGen(user, true),
          refresh_token: refreshTokenGen(user),
          user
        });
      } else {
        let relations = await Relation.countDocuments({ $or: [{ petitioner: user._id }, { receptor: user._id }], isActive: true }).exec();
        user.google.id = data.data.sub;
        user.lastLogin = Date.now();
        await user.save();

        user = user.toJSON();
        user.relationsCount = relations;
        res.send({
          access_token: accessTokenGen(user, true),
          refresh_token: refreshTokenGen(user),
          user
        });
      }
    })
    .catch(err => {
      return next(err);
    });
};

export const password = (req, res, next) => {
  const { newPassword } = req.body;
  logy("enter restart password");
  User.findById(req.params.id, USER_DATA_SELECT, function (err, user) {
    if (err) next(err);
    if (!user) next(createError(404, req.lg.user.notFound));

    user.security.hash = user.generateHash(newPassword);

    if (user.isActive) next(createError(401, req.lg.user.notActive));

    user.lastLogin = Date.now();
    if (user.activeScope == "" || !user.activeScope || user.activeScope == null) {
      user.activeScope = user._id;
    }
    user.save(async err => {
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
        access_token: accessTokenGen(user, true),
        refresh_token: refreshTokenGen(user),
        user
      });
    });
  });
};
export const login = async (req, res, next) => {
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
    .select(USER_DATA_SELECT)
    .populate("scope.id")
    .populate("currency")
    .populate("sections")
    .exec(async (err, user) => {
      // if there are any errors, return the error before anything else
      if (err) return next(err);

      // if no user is found, return the message
      if (!user) next(notFoundError());
      const isValid = typeof req.body.password !== "undefined" ? await User.validPassword(user._id.toString(), req.body.password) : false;
      delete user.password;
      if (!isValid) next(createError(403, req.lg.user.wrongPassword));
      if (!user.isActive) next(createError(401, req.lg.user.notActive));

      user.lastLogin = Date.now();
      if (user.activeScope == "" || !user.activeScope || user.activeScope == null) {
        user.activeScope = user._id;
      }

      user.save(async err => {
        if (err) next(err);
        let relations = await Relation.countDocuments({ $or: [{ petitioner: user._id }, { receptor: user._id }], isActive: true }).exec();

        req.user = user;
        req.user.id = req.user._id.toString() || null;
        res.statusMessage = req.lg.user.successLogin;
        delete user.password;
        user = user.toJSON();
        user.relations = relations;

        res.json({
          access_token: accessTokenGen(user, true),
          refresh_token: refreshTokenGen(user),
          user
        });
      });
    });
};
export const refreshToken = async (req, res, next) => {
  try {
    res.send({ access_token: getTokenByRefresh(req.body.refresh_token) });
  } catch (err) {
    next(err);
  }
};

export const verify = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) next(err);
    if (!user) next(createError(404, req.lg.user.notFound));
    if (user.security.activateHash !== req.body.hash) next(createError(403, req.lg.user.notVerified));
    user.isActive = true;
    res.statusMessage = req.lg.user.verified;

    user.save(async (err, user) => {
      await user.populate([
        {
          path: "scope.id",
          select: "name"
        }
      ]);
      req.user = user;
      req.user.id = req.user._id.toString() || null;
      res.json({
        access_token: accessTokenGen(user, true),
        refresh_token: refreshTokenGen(user),
        user
      });
    });
  });
};
export const register = async (req, res, next) => {
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

  try {
    let user = await User.findOne(query).select("_id").lean();

    // check to see if theres already a user with that email
    if (user?._id) next(createError(409, user.username === req.body.username ? req.lg.user.alreadyExist : req.lg.user.alreadyRegistered));

    // if there is no user with that email
    // create the user
    let newUser = new User();

    newUser.currency = await getCurrencyByLocation(req);
    let password;
    let activateHash;
    logy(req.body.password);

    // if the user register without password, we generate one random, and ask to verify the account
    if ((typeof req.body.password === "undefined" || req.body.password === null) && typeof req.body.noPassword === "undefined") {
      password = Math.random().toString(36).substring(2, 15);
      activateHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      newUser.password = newUser.generateHash(password);
      newUser.security.updatedAt = new Date();
      newUser.security.isRandom = true;
      newUser.security.activateHash = activateHash;
      newUser.security.hasPassword = false;
      newUser.isActive = false;
    } else if (typeof req.body.noPassword === "undefined") {
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

    newUser.activeScope = newUser._id;
    // save the user
    await newUser.save();
    user = newUser.toJSON();
    // TODO, send email asking to verify account if the password is generated by the system.

    req.user = user;
    req.user.id = req.user._id.toString() || null;
    res.json({
      access_token: accessTokenGen(user, true),
      refresh_token: refreshTokenGen(user),
      user: user
    });
  } catch (err) {
    // if there are any errors, return the error
    next(err);
  }
};
export const googleCallback = async (req, res, next) => {
  // Successful authentication, redirect home.
  logger("callbackg");
  if (typeof req.user.history.emailUrl != "undefined") {
    let url = req.user.history.emailUrl;
    let update = {
      $unset: {
        "history.emailUrl": ""
      }
    };
    await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      update,
      {},
      (err, user) => {
        if (err) next(err);
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
    await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      update,
      {},
      (err, user) => {
        if (err) next(err);
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
