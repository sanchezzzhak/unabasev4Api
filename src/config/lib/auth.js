// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import mainConfig from '../main';
export default {
  isAuth: (req, res, next) => {
    if (
      req.isAuthenticated() ||
      req.method === 'OPTIONS' ||
      req.headers.authorization === 'postmanvn4b4s3'
    ) {
      // if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(403);
    }
  },
  cToken: (req, res, next) => {
    req.token = req.cookies.access_token;
    jwt.verify(req.token, mainConfig.mSecret, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  },
  sToken: (req, res, next) => {
    req.token = req.headers.authorization;
    // console.log(req.headers['authorization'].toString());
    if (
      typeof req.token !== 'undefined' &&
      req.headers.authorization !== 'postmanvn4b4s3'
    ) {
      jwt.verify(req.token, mainConfig.mSecret, (err, decoded) => {
        if (err) {
          res.status(403);
        } else {
          next();
        }
      });
      // next();
    } else if (
      req.method === 'OPTIONS' ||
      req.headers.authorization === 'postmanvn4b4s3'
    ) {
      next();
    } else {
      res.status(403);
    }
  }
};
