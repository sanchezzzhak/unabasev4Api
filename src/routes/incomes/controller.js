import bool from 'normalize-bool';
import Income from '../../models/income';

import itemLine from '../../models/itemLine';
const routes = {
  get(req, res) {
    console.log('enter get incomes');
    let query = {};
    let options = {};
    options.page = parseInt(req.query.page) || 1;
    options.limit = parseInt(req.query.limit) || 20;
    query.name = req.query.name || null;
    query.active = bool(req.query.active) || null;

    Income.paginate(query, options, (err, incomes) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(incomes);
      }
    });
  },
  create(req, res) {
    const { name, description, client, state, items, newItems } = req.body;
    let newIncome = new Income();
    newIncome.name = name || null;
    newIncome.description = description || null;
    newIncome.client = client || null;
    // newIncome.creator = req.user._id || null;
    newIncome.state = state || null;
    newIncome.items = [];
    // console.log(newIncome);
    items.forEach(i => {
      newIncome.items.push(i);
    });
    let errorOnItem = { state: false };
    newItems.forEach(i => {
      let line = new itemLine();
      line.name = i.name;
      line.tax = i.tax;
      line.quantity = i.quantity;
      line.save((err, lineSaved) => {
        if (err) {
          (errorOnItem.state = true), (errorOnItem.msg = err);
        } else {
          newIncome.items.push(lineSaved._id);
        }
      });
    });
    newIncome.save((err, income) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.send(income);
      }
    });
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
    Income.findOneAndUpdate({}, {}, { new: true }, (err, income) => {});
  }
};

module.exports = routes;
