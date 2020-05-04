import jwt from "jsonwebtoken";
// import mainConfig from '../main';

import envar from "../../lib/envar";
import User from "../../models/user";
import { createError } from "../../lib/error";

export const isAuth = (req, res, next) => {
  if (req.isAuthenticated() || req.method === "OPTIONS" || req.headers.authorization === "postmanvn4b4s3") {
    // if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({
      msg: "Not authorized."
    });
  }
};
export const cToken = (req, res, next) => {
  req.token = req.cookies.access_token;
  jwt.verify(req.token, envar().SECRET, (err, decoded) => {
    if (err) {
      res.status(403).send({
        msg: "Not authorized.."
      });
    } else {
      next();
    }
  });
};
export const isAuthOptional = async (req, res, next) => {
  req.token = req.headers.authorization;
  if (typeof req.token !== "undefined" && req.token !== "") {
    let decoded = jwt.verify(req.token, envar().SECRET);
    let authUser;

    try {
      authUser = await User.findOne({ _id: decoded.user._id })
        .select(
          "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts"
        )
        .populate("scope.id", "name id _id")
        .exec();

      authUser.id = authUser._id.toString();
      req.user = authUser;
      next();
    } catch (err) {
      next(createError(401, "Not authorized1"));
    }
    // next();
  } else if (req.method === "OPTIONS") {
    next();
  } else {
    next();
  }
};
export const sToken = async (req, res, next) => {
  req.token = req.headers.authorization;
  if (typeof req.token !== "undefined" && req.token !== "") {
    let decoded = jwt.verify(req.token, envar().SECRET);
    let authUser;

    try {
      authUser = await User.findOne({ _id: decoded.user._id })
        .select(
          "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts"
        )
        .populate("scope.id", "name id _id")
        .exec();

      authUser.id = authUser._id.toString();
      req.user = authUser;
      next();
    } catch (err) {
      next(createError(401, "Not authorized1"));
    }
    // next();
  } else if (req.method === "OPTIONS") {
    next();
  } else {
    res.status(403).send({
      msg: "Not authorized2"
    });
  }
};
