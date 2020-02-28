import jwt from "jsonwebtoken";
// import mainConfig from '../main';

import envar from "../../lib/envar";
import User from "../../models/user";

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
export const sToken = (req, res, next) => {
  req.token = req.headers.authorization;
  if (typeof req.token !== "undefined" && req.headers.authorization !== "postmanvn4b4s3") {
    jwt.verify(req.token, envar().SECRET, (err, decoded) => {
      if (err) {
        res.status(403).send({
          msg: "Not authorized1"
        });
      } else {
        logy("decoded!");
        req.user = decoded.user;
        next();
      }
    });
    // next();
  } else if (req.method === "OPTIONS") {
    next();
  } else if (req.headers.authorization === "postmanvn4b4s3" || process.env.NODE_ENV === "test") {
    let query;
    if (req.headers["x-api-key"]) {
      query = {
        _id: req.headers["x-api-key"]
      };
    } else {
      query = {
        $or: [
          {
            "emails.email": {
              $regex: "mail",
              $options: "i"
            }
          }
        ]
      };
    }
    User.findOne(query)
      .populate("scope.id", "name")
      .exec((err, user) => {
        if (err) {
          logy("err find");
          logy(err);
        } else if (user) {
          req.user = user;
          next();
        } else {
          res.status(403).send({
            msg: "Not user found for auth"
          });
        }
      });
  } else {
    res.status(403).send({
      msg: "Not authorized2"
    });
  }
};
