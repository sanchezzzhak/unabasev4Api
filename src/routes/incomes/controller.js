const Incomes = require("../../models/income");
const bool = require("normalize-bool");
const routes = {
  get(req, res) {
    let query = {};
    let options = {};
    // if (req.query) {
    options.page = parseInt(req.query.page) || 1;
    options.limit = parseInt(req.query.limit) || 20;
    query.name = req.query.name || null;
    query.active = bool(req.query.active) || null;
    // }
    Incomes.paginate(query, options, (err, incomes) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(incomes);
      }
    });
  },
  create(req, res) {
    const { name, description, client, state } = req.body;
    let newIncome = new Incomes();
    newIncome.name = name || null;
    newIncome.description = description || null;
    newIncome.client = client || null;
    newIncome.creator = req.user._id || null;
    newIncome.state = state || null;
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
    Incomes.findOne({ _id: req.params.id }, (err, income) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(income);
      }
    });
  },
  updateOne(req, res) {
    Incomes.findOneAndUpdate({}, {}, { new: true }, (err, income) => {});
  }
};

module.exports = routes;
