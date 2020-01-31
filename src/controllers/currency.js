import Currency from "../models/currency";
import ntype from "normalize-type";

export const get = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;
  let query = { ...rquery };
  Currency.paginate(query, options, (err, items) => {
    if (err) next(err);
    res.json(items);
  });
};
export const create = (req, res, next) => {
  let currency = new Currency();
  Object.assign(currency, req.body);
  currency.save((err, item) => {
    if (err) next(err);
    res.send(item);
  });
};

export const getOne = (req, res, next) => {
  Currency.findById(req.params.id, (err, item) => {
    if (err) next(err);
    res.send(item);
  });
};
export const find = (req, res, next) => {
  let query = {
    name: { $regex: req.params.q, $options: "i" }
  };
  Currency.paginate(query, {}, (err, items) => {
    if (err) next(err);
    res.send(items);
  });
};
export const updateOne = (req, res, next) => {
  Currency.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, item) => {
    if (err) next(err);
    res.send(item);
  });
};

export const deleteOne = (req, res, next) => {
  Currency.findByIdAndDelete(req.params.id).exec(err => {
    if (err) next(err);
    res.send({ success: true });
  });
};
