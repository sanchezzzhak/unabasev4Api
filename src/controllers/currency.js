import Currency from "../models/currency";
import ntype from "normalize-type";

// const routes = {
export const get = (req, res) => {
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
};
export const create = (req, res) => {
  let currency = new Currency();
  Object.assign(currency, req.body);
  currency.save((err, item) => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      res.send(item);
    }
  });
};
export const update = (req, res) => {
  let query = { _id: req.params.id };

  Currency.findByIdAndUpdate(query, req.body, { new: true }).exec((err, item) => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      res.send(item);
    }
  });
};
export const getOne = (req, res) => {
  Currency.findById(req.params.id, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
};
export const find = (req, res) => {
  let query = {
    name: { $regex: req.params.q, $options: "i" }
  };
  Currency.paginate(query, {}, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const updateOne = (req, res) => {
  Currency.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
};

export const deleteOne = (req, res, next) => {
  Currency.findByIdAndDelete(req.params.id).exec(err => {
    if (err) next(err);
    res.send({ success: true });
  });
};
// };

// export default routes;
