import User from '../../models/user';

import ntype from 'normalize-type';
export default {
  password: (req, res) => {
    const { password, newPassword } = req.body;

    User.findById(req.params.id, function(err, user) {
      if (typeof user.password === 'undefined') {
        res.status(200).send({ msg: 'password changed' });

        user.password = user.generateHash(newPassword);
        user.save();
      } else if (user.validPassword(password)) {
        user.password = user.generateHash(newPassword);
        user.save();
        res.status(200).send({ msg: 'password changed' });
      } else {
        res.status(500).send({ msg: 'password change failed' });
      }
    });
  },
  logout: (req, res) => {
    console.log('out');
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
  postUsers: (req, res) => {
    console.log('req.body post');
    console.log(req.body);
    User.paginate(
      {},
      { page: req.body.page || 1, limit: req.body.limit || 20 },
      (err, users) => {
        if (err) {
          console.log(err);
        } else {
          res.send(users);
        }
      }
    );
  },
  getUser: (req, res) => {
    User.findOne({ id: req.params.id }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        res.send(user.getUser());
      }
    });
  },
  updateUser: (req, res) => {
    Array({ type: Object }), Array({ type: Object });
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
