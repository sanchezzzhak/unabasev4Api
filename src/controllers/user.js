import User from '../models/user';

import ntype from 'normalize-type';
import logger from '../config/lib/logger';
import findByValue from '../lib/findObjectByValue';

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
    console.log('list users');
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
  getOne: (req, res) => {
    console.log(req.params.id);
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (user) {
        res.send(user.getUser());
      } else {
        res.status(404).send({ msg: 'user not found' });
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
  business: (req, res) => {
    let update = {
      $addToSet: { business: req.body.business }
    };
    User.findByIdAndUpdate(
      req.params.id,
      update,
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
  scope: (req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      { scope: req.body.business },
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
  findOne: (req, res) => {
    let query = {
      $and: []
    };
    console.log('find one!!');
    Object.keys(req.query).forEach(q => {
      if (q === 'email') {
        query.$and.push({
          [`emails`]: { $regex: req.query[q], $options: 'i' }
        });
      } else {
        query.$and.push({ [q]: { $regex: req.query[q], $options: 'i' } });
      }
    });
    console.log(query.$and);
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
