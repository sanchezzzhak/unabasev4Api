import Currency from '../models/currency';
import ntype from 'normalize-type';

const routes = {
  get: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery };
    Currency.paginate(query, options, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(items);
      }
    });
  },
  create: (req, res) => {
    let currency = new Currency();
    Object.assign(currency, req.body);
    currency.save((err, item) => {
      if (err) {
        res.status(500).send({ msg: err });
      } else {
        res.send(item);
      }
    });
  },
  update: (req, res) => {
    let query = { _id: req.params.id };

    Currency.findByIdAndUpdate(query, req.body, { new: true }).exec(
      (err, item) => {
        if (err) {
          res.status(500).send({ msg: err });
        } else {
          res.send(item);
        }
      }
    );
  },
  getOne: (req, res) => {
    Currency.findById(req.params.id, (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    });
  },
  find: (req, res) => {
    let query = {
      name: { $regex: req.params.q, $options: 'i' }
    };
    Currency.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(items);
      }
    });
  },
  updateOne: (req, res) => {
    Currency.findOneAndUpdate(
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
  }
};

export default routes;
