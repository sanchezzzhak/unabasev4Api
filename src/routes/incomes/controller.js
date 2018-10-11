import bool from 'normalize-bool';
import Income from '../../models/income';

import itemLine from '../../models/itemLine';
import database from '../../config/database';
import { totalmem } from 'os';
const routes = {
  get(req, res) {
    console.log('enter get incomes');
    let query = {};
    let options = {};
    options.page = parseInt(req.query.page) || 1;
    options.limit = parseInt(req.query.limit) || 20;
    // query.name = req.query.name || null;
    // query.active = bool(req.query.active) || null;
    console.log(query);
    Income.paginate(query, options, (err, incomes) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(incomes);
      }
    });
  },
  create: (req, res) => {
    const { name, description, client, state, items } = req.body;
    let errorOnItem = { state: false };
    let newIncome = new Income();
    newIncome.name = name || null;
    newIncome.description = description || null;
    newIncome.client = client || null;
    newIncome.state = state || null;
    newIncome.items = new Array();
    newIncome.dates = {
      expiration: req.body.expiration
    };
    items.forEach(i => {
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
          console.log(line._id);
          newIncome.items.push(line._id);
        }
      });
    });
    setTimeout(() => {
      newIncome.save((err, income) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        } else {
          console.log('sssssn');
          res.send(income);
        }
      });
    }, 500);
  },
  getOne(req, res) {
    Income.findOne({ _id: req.params.id }, (err, income) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(income);
      }
    });
  },
  findOne(req, res) {
    let query = {
      $or: [{ name: req.query.name || null }]
    };
    Income.findOne({ _id: req.params.id }, (err, income) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(income);
      }
    });
  },
  updateOne(req, res) {
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
      items: []
    };

    req.body.items.forEach(i => {
      update.items.push(i);
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

module.exports = routes;
