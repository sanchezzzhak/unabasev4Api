import User from '../models/user';

import ntype from 'normalize-type';
// import findByValue from '../lib/findObjectByValue';
// import accountTypeByUrl from '../lib/accountTypeByUrl';
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

          user.password.hash = user.generateHash(newPassword);
          user.save();
        } else if (user.validPassword(password)) {
          user.password.hash = user.generateHash(newPassword);
          user.save();
          res.status(200).send({ msg: 'password changed' });
        } else {
          res.status(500).send({ msg: 'password change failed' });
        }
      }
    });
  },
  restartPassword: (req, res) => {
    let query = {
      $or: [
        { username: { $regex: req.params.q, $options: 'i' } },
        { 'emails.email': { $regex: req.params.q, $options: 'i' } }
      ]
    };
    User.findOne(query, (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else if (user) {
        const { text, subject } = template().restartPassword({
          origin: req.headers.origin,
          lang: req.locale.language,
          id: item._id
        });
        const msg = {
          to: req.body.email,
          subject: subject,
          html: text
        };
        send(msg)
          .then(res => {
            res.status(200).send({ msg: 'password restart success' });
          })
          .catch(err => {
            res.status(500).send(err);
          });
      } else {
        res.status(404).send({ msg: 'user not found' });
      }
    });
  },
  logout: (req, res) => {
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
    const type = req.query.type || 'personal';
    let query = { ...rquery, type };
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
    req.body.password.hash = User.hash(req.body.password.hash);
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

    const type = req.query.type || 'personal';
    User.findOne({ _id: req.params.id, type }, (err, user) => {
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
  user: (req, res) => {
    let update = {
      $addToSet: { users: req.body.user }
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
  find: (req, res) => {
    const type = req.query.type || 'personal';
    let query = {
      $and: [
        {
          $or: [
            { 'emails.email': { $regex: req.params.q, $options: 'i' } },
            { name: { $regex: req.params.q, $options: 'i' } },
            { username: { $regex: req.params.q, $options: 'i' } },
            { idnumber: { $regex: req.params.q, $options: 'i' } }
          ]
        },
        { type }
      ]
    };
    console.log('find one!!');
    // Object.keys(req.query).forEach(q => {
    //   if (q === 'email') {
    //     query.$or.push({
    //       'emails.email': { $regex: req.query[q], $options: 'i' }
    //     });
    //   } else {
    //     query.$or.push({ [q]: { $regex: req.query[q], $options: 'i' } });
    //   }
    // });
    console.log(query);
    User.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(items);
      }
    });
  }
};
