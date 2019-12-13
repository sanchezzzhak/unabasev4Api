import Role from "../models/role";
import UserPermission from "../models/userPermission";
import Permission from "../models/permission";

export const create = (req, res) => {
  Role.create(req.body, (err, role) => {
    if (err) {
      errorHandler({ code: 500, err, res });
    } else {
      res.send(role);
    }
  });
};

export const update = (req, res) => {
  Role.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, role) => {
    if (err) {
      errorHandler({ code: 500, err, res });
    } else {
      res.send(role);
    }
  });
};

export const find = (req, res) => {
  let options = {};
  options.page = req.query.page || 1;
  options.limit = req.query.limit || 20;
  options.populate = [
    {
      path: "permissions"
    }
  ];
  delete req.query.page;
  delete req.query.limit;

  Role.paginate(req.query, options, (err, roles) => {
    if (err) {
      errorHandler({ code: 500, err, res });
    } else {
      res.send(roles);
    }
  });
};

export const get = (req, res) => {
  Role.findById(req.params.id)
    .populate([
      {
        path: "permissions"
      }
    ])
    .exec((err, role) => {
      if (err) {
        errorHandler({ code: 500, err, res });
      } else {
        res.send(role);
      }
    });
};

export const apply = (req, res) => {
  // let errors = [];
  let userPermissions = [];
  Role.findById(req.body.role)
    .populate("permissions")
    .exec((err, role) => {
      if (err) {
        errorHandler({ code: 500, err, res });
      } else {
        role.permissions.forEach(permission => {
          userPermissions.push({
            user: req.body.user,
            business: req.body.business,
            permission: permission._id
          });
        });
        try {
          UserPermission.insertMany(userPermissions, { ordered: false }, (err, docs) => {
            if (err) {
              console.log(err);
              if (err.code === 11000 && err.name === "BulkWriteError") {
                res.send({ success: true });
              } else {
                res.status(500).end();
              }
            } else {
              res.semd({ message: "Perfil aplicado con exito" });
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
};
