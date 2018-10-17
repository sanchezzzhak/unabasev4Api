import User from '../models/user';

import ntype from 'normalize-type';
import logger from '../config/lib/logger';

export default {
  password: (req, res) => {
    const { password, newPassword } = req.body;
    console.log(req.body);
    User.findById(req.params.id, function(err, user) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (typeof user.password === 'undefined') {
          res.status(200).send({ msg: 'password created' });

          user.password = user.generateHash(newPassword);
          user.save();
        } else if (user.validPassword(password)) {
          user.password = user.generateHash(newPassword);
          user.save();
          res.status(200).send({ msg: 'password changed' });
        } else {
          res.status(500).send({ msg: 'password change failed' });
        }
      }
    });
  },
  logout: (req, res) => {
    logger('out');
    req.logout();
    req.session = null;
    res.status(200).send('Log out');
  },
  get: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery };
    // query.name = req.query.name || null;
    // query.isActive = bool(req.query.active) || null;

    User.paginate(query, options, (err, item) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(item);
      }
    });
  },
  create: (req, res) => {
    let user = new User();
    req.body.password = User.hash(req.body.password);
    Object.assign(user, req.body);
    user.save((err, item) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(item);
      }
    });
  },
  getUser: (req, res) => {
    User.findOne({ id: req.params.id }, (err, user) => {
      if (err) {
        logger(err);
      } else {
        res.send(user.getUser());
      }
    });
  },
  update: (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(item);
        }
      }
    );
  },
  createUser: (req, res) => {},
  findOne: (req, res) => {
    let query = {
      $and: []
    };
    Object.keys(req.query).forEach(q => {
      if (q === 'email' || q === 'name') {
        query.$and.push({
          [`google.${q}`]: { $regex: req.query[q], $options: 'i' }
        });
      }
      query.$and.push({ [q]: { $regex: req.query[q], $options: 'i' } });
    });

    User.findOne(query, (err, user) => {
      if (err) {
        res.status(500).end();
      } else if (user) {
        res.send(user);
      } else {
        res.status(404).end();
      }
    });
  }
};
