import bool from 'normalize-bool';
import Income from '../models/income';

import itemLine from '../models/itemLine';

import logger from '../config/lib/logger';
const routes = {
  get(req, res) {
    logger('list incomes');
    let query = {};
    let options = {};
    options.page = parseInt(req.query.page) || 1;
    options.limit = parseInt(req.query.limit) || 20;
    options.select = 'name client.name createdAt total state';
    options.populate = [{ path: 'client', select: 'name' }];
    // query.name = req.query.name || null;
    // query.active = bool(req.query.active) || null;
    logger(query);
    Income.paginate(query, options, (err, incomes) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(incomes);
      }
    });
  },
  create: (req, res) => {
    const { name, dates, client, state, lines, description } = req.body;
    let errorOnItem = { state: false };
    let newIncome = new Income();
    newIncome.name = name || null;
    newIncome.description = description || null;
    newIncome.client = client || null;
    newIncome.creator = req.user._id || null;
    newIncome.state = state || null;
    newIncome.lines = new Array();
    newIncome.dates = {
      expiration: req.body.dates.expiration
    };
    newIncome.total = {};
    newIncome.total.net = req.body.total.net;
    newIncome.total.tax = req.body.total.tax;
    lines.forEach(i => {
      let newLine = new itemLine();
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
          newIncome.lines.push(line._id);
        }
      });
    });
    setTimeout(() => {
      newIncome.save((err, income) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          logger('sssssn');
          res.send(income);
        }
      });
    }, 500);
  },
  getOne(req, res) {
    Income.findOne({ _id: req.params.id })

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
      .exec((err, income) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(income);
        }
      });
  },
  findOne: (req, res) => {
    let query = {
      $or: [{ name: req.query.name || null }]
    };
    Income.findOne({ _id: req.params.id })
      .populate('items')
      .populate('creator', 'name')
      .exec((err, income) => {
        if (err) {
          res.status(500).end();
        } else {
          res.send(income);
        }
      });
  },
  updateOne: (req, res) => {
    let update = {
      name: req.body.name,
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

    req.body.lines.forEach(i => {
      if (i._id) {
        itemLine.findByIdAndUpdate(i._id, i, { new: true }, (err, line) => {
          if (err) console.log(err);
          else {
            update.lines.push(i._id);
          }
        });
      } else {
        let newLine = new itemLine();
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
    Income.findOneAndUpdate(
      { _id: req.params.id },
      update,
      { new: true },
      (err, income) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.send(income);
        }
      }
    );
  }
};

export default routes;
