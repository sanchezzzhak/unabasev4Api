import Permission from "../models/permission";
import UserPermission from "../models/userPermission";
import Role from "../models/role";
import { queryHelper } from "../lib/queryHelper";

export const create = (req, res) => {
  Permission.create(req.body, (err, permission) => {
    if (err) return next(err);
    res.send(permission);
  });
};

export const update = (req, res, next) => {
  Permission.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }).exec((err, permission) => {
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

// TODO controller can be replaced by find in the userPermission controller
//HECTOR -  USUARIOS QUE TIENEN UN PERMISO DENTRO DE LA EMPRESA (ESPECIFICO)

export const findUsersByPermission = (req, res) => {
  let options = {};
  options.page = req.query.page || 1;
  options.limit = req.query.limit || 20;
  options.populate = {
    path: "user",
    select: "name idNumber imgUrl"
  };

  delete req.query.page;
  delete req.query.limit;

  UserPermission.paginate(
    {
      permission: req.params.permissionId,
      business: req.params.businessId
    },
    options,
    (err, users) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.send(users);
      }
    }
  );
};

// TODO controller can be replaced by find in the role controller
// HECTOR - GET USER ROLES

export const getUserRoles = (req, res, next) => {
  let helper = queryHelper(req.query, {});
  let populate = {
    path: "permissions",
    select: "name path action module"
  };
  Role.paginate(
    helper.query,
    {
      populate
    },
    (err, roles) => {
      if (err) return next(err);
      res.send(roles);
    }
  );
};
