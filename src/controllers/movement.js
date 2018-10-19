import bool from 'normalize-bool';
import Movement from '../models/movement';

import Line from '../models/line';

import logger from '../config/lib/logger';
const routes = {
  get(req, res) {
    logger('list movements');
    let query = {};
    let options = {};
    options.page = parseInt(req.query.page) || 1;
    options.limit = parseInt(req.query.limit) || 20;
    options.select = 'name client.name createdAt total state';
    options.populate = [{ path: 'client', select: 'name' }];
    // query.name = req.query.name || null;
    // query.active = bool(req.query.active) || null;
    logger(query);
    Movement.paginate(query, options, (err, movements) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(movements);
      }
    });
  },
  create: (req, res) => {
    const { name, dates, client, state, lines, description } = req.body;
    let errorOnItem = { state: false };
    let newMovement = new Movement();
    newMovement.name = name || null;
    newMovement.description = description || null;
    newMovement.client = client || null;
    newMovement.creator = req.user._id || null;
    newMovement.state = state || null;
    newMovement.lines = new Array();
    newMovement.dates = {
      expiration: req.body.dates.expiration
    };
    newMovement.total = {};
    newMovement.total.net = req.body.total.net;
    newMovement.total.tax = req.body.total.tax;
    lines.forEach(i => {
      let newLine = new Line();
      newLine.name = i.name;
      newLine.tax = i.tax;
      newLine.quantity = i.quantity;
      newLine.price = i.price;
      newLine.item = i.item;
      newLine.save((err, line) => {
        if (err) {
          errorOnItem.state = true;
          errorOnItem.msg = err;
        } else {
          logger(line._id);
          newMovement.lines.push(line._id);
        }
      });
    });
    setTimeout(() => {
      newMovement.save((err, movement) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          logger('sssssn');
          res.send(movement);
        }
      });
    }, 500);
  },
  getOne(req, res) {
    Movement.findOne({ _id: req.params.id })

      // .populate('lines creator', 'creator.name')
      // .populate('creator', 'name')
      // .populate('creator', 'google.email')
      // .populate('client', 'google.email')
      // .populate('client', 'name')
      .populate([
        { path: 'lines' },
        { path: 'creator', select: 'name google.email emails.default' },
        { path: 'client', select: 'name google.email emails.default' }
      ])
      .exec((err, movement) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(movement);
        }
      });
  },
  findOne: (req, res) => {
    let query = {
      $or: [{ name: req.query.name || null }]
    };
    Movement.findOne({ _id: req.params.id })
      .populate('items')
      .populate('creator', 'name')
      .exec((err, movement) => {
        if (err) {
          res.status(500).end();
        } else {
          res.send(movement);
        }
      });
  },
  find: (req, res) => {
    let query = {
      $or: [{ name: { $regex: req.query.query, $options: 'i' } }]
    };
    let options = {};
    Movement.paginate(query, options, (err, movement) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(movement);
      }
    });
  },
  updateOne: (req, res) => {
    let update = {
      name: req.body.name,
      isActive: req.body.isActive,
      description: req.body.description,
      dates: {
        expiration: req.body.expiration
      },
      client: req.body.client,
      total: {
        net: req.body.net,
        tax: req.body.tax
      },
      state: req.body.state,
      currency: req.body.currency,
      lines: []
    };
    if (typeof req.body.lines !== 'undefined')
      req.body.lines.forEach(i => {
        if (i._id) {
          Line.findByIdAndUpdate(i._id, i, { new: true }, (err, line) => {
            if (err) console.log(err);
            else {
              update.lines.push(i._id);
            }
          });
        } else {
          let newLine = new Line();
          newLine.name = i.name;
          newLine.tax = i.tax;
          newLine.quantity = i.quantity;
          newLine.price = i.price;
          newLine.item = i.item;
          newLine.save((err, line) => {
            if (err) {
              errorOnItem.state = true;
              errorOnItem.msg = err;
            } else {
              logger(line._id);
              update.lines.push(line._id);
            }
          });
        }
      });
    Movement.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true },
      (err, movement) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.send(movement);
        }
      }
    );
  }
};

export default routes;
