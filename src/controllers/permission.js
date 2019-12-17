import Permission from "../models/permission";
import { queryHelper } from "../lib/queryHelper";

export const create = (req, res) => {
  Permission.create(req.body, (err, permission) => {
    if (err) return next(err);
    res.send(permission);
  });
};

export const update = (req, res, next) => {
  Permission.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec((err, permission) => {
    if (err) return next(err);
    res.send(permission);
  });
};

export const get = (req, res, next) => {
  Permission.findById(req.params.id).exec((err, permission) => {
    if (err) return next(err);
    res.send(permission);
  });
};

export const find = (req, res, next) => {
  let helper = queryHelper(req.query, {});
  Permission.paginate(helper.query, helper.options, (err, permissions) => {
    if (err) return next(err);
    res.send(permissions);
  });
};
