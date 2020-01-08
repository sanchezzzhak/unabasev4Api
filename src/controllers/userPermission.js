import UserPermission from "../models/userPermission";
import {
  queryHelper
} from "../lib/queryHelper";

export const create = (req, res, next) => {
  UserPermission.create(req.body, (err, userPermission) => {
    if (err) return next(err);
    res.send(userPermission);
  });
};
export const deleteOneById = (req, res, next) => {
  UserPermission.deleteOne({
    _id: req.params.id
  }, err => {
    if (err) next(err);
    res.send({
      success: true
    });
  });
};
export const deleteOne = (req, res, next) => {
  const {
    business,
    user,
    permission
  } = req.body;
  if (user && business && permission) {
    UserPermission.deleteOne({
      business,
      user,
      permission
    }, err => {
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
  // if (req.query.user && req.query.business) {

  let populate = [{
      path: "user",
      select: "isActive name  email phone user imgUrl emails type"
    },
    {
      path: "business",
      select: "isActive name  email phone user imgUrl emails type"
    },
    {
      path: "permission"
    }
  ];
  let helper = queryHelper(req.query, {
    populate
  });

  UserPermission.paginate(helper.query, helper.options, (err, userPermissions) => {
    if (err) return next(err);
    res.send(userPermissions);
  });
  // } else {
  //   let err = new Error();
  //   err.statusCode = 406;
  //   err.message = "data is not enough";
  //   return next(err);
  // }
};