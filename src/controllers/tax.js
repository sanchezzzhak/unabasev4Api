import Tax from "../models/tax";
import ntype from "normalize-type";

export const get = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;
  let query = { ...rquery };
  Tax.paginate(query, options, (err, taxes) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(taxes);
    }
  });
};
export const getOne = (req, res, next) => {
  logy(req.params.id);
  Tax.findById(req.params.id, (err, tax) => {
    if (err) {
      res.status(500).end(err);
    } else if (tax) {
      res.send(tax);
    } else {
      res.status(404).send({ msg: "tax not found" });
    }
  });
};
export const create = (req, res, next) => {
  let tax = new Tax();
  let { name, number } = req.body;
  tax.name = name;
  tax.number = number;
  tax.save((err, newTax) => {
    if (err) {
      res.status(500).end(err);
    } else {
      res.send(newTax);
    }
  });
};
export const updateOne = (req, res, next) => {
  Tax.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
};
export const find = (req, res, next) => {
  let query = {
    name: { $regex: req.params.q, $options: "i" }
  };
  Tax.paginate(query, {}, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};

export const deleteOne = (req, res, next) => {
  Tax.findByIdAndDelete(req.params.id).exec(err => {
    if (err) next(err);
    res.send({
      success: true
    });
  });
};
