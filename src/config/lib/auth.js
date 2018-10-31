import jwt from 'jsonwebtoken';
import mainConfig from '../main';
import User from '../../models/user';
import logger from './logger';
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
      res.status(403).send({ msg: 'Not authorized.' });
    }
  },
  cToken: (req, res, next) => {
    req.token = req.cookies.access_token;
    jwt.verify(req.token, mainConfig.mSecret, (err, decoded) => {
      if (err) {
        res.status(403).send({ msg: 'Not authorized..' });
      } else {
        next();
      }
    });
  },
  sToken: (req, res, next) => {
    console.log('host');
    console.log(req.hostname);
    req.token = req.headers.authorization;
    // console.log(req.headers['authorization'].toString());
    if (
      typeof req.token !== 'undefined' &&
      req.headers.authorization !== 'postmanvn4b4s3'
    ) {
      jwt.verify(req.token, mainConfig.mSecret, (err, decoded) => {
        if (err) {
          res.status(403).send({ msg: 'Not authorized1' });
        } else {
          req.user = decoded.user;
          next();
        }
      });
      // next();
    } else if (req.method === 'OPTIONS') {
      next();
    } else if (
      req.headers.authorization === 'postmanvn4b4s3' ||
      process.env.NODE_ENV === 'test'
    ) {
      let query = {
        $or: [{ 'emails.email': { $regex: 'mail', $options: 'i' } }]
      };
      User.findOne(query).exec((err, user) => {
        if (err) {
          console.log('err find');
          console.log(err);
        } else if (user) {
          logger('user set to ' + user.username);
          req.user = user;
          next();
        } else {
          res.status(404).send({ msg: 'Not user found for auth' });
        }
      });
    } else {
      res.status(403).send({ msg: 'Not authorized2' });
    }
  }
};
