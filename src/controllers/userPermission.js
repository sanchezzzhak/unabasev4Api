import UserPermission from "../models/userPermission";
import { errorHandler, ErrorHandler } from "../lib/error";

export const create = (req, res, next) => {
  UserPermission.create(req.body, (err, userPermission) => {
    if (err) return next(err);
    res.send(userPermission);
  });
};
export const deleteOneById = (req, res, next) => {
  UserPermission.deleteOne({ _id: req.params.id }, err => {
    if (err) next(err);
    res.send({
      success: true
    });
  });
};
export const deleteOne = (req, res, next) => {
  const { business, user, permission } = req.body;
  if (user && business && permission) {
    UserPermission.deleteOne({ business, user, permission }, err => {
      if (err) return next(err);

      res.send({
        success: true
      });
    });
  } else {
    let err = new Error();
    err.message = "data is not enough";
    err.statusCode = 400;
    return next(err);
  }
};

export const find = (req, res, next) => {
  // TODO   function to check params
  if (req.body.user && req.body.business) {
    let options = {};
    options.page = req.body.page || 1;
    options.limit = req.body.limit || 20;
    options.populate = [
      {
        path: "user",
        select: "isActive name  email phone user imgUrl emails type"
      },
      {
        path: "business",
        select: "isActive name  email phone user imgUrl emails type"
      },
      { path: "permission" }
    ];
    delete req.body.page;
    delete req.body.limit;
    UserPermission.paginate(req.query, options, (err, userPermissions) => {
      if (err) return next(err);
      res.send(userPermissions);
    });
  } else {
    let err = new Error();
    err.statusCode = 406;
    err.message = "data is not enough";
    return next();
  }
};
