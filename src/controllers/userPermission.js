import UserPermission from "../models/userPermission";

export const create = (req, res) => {
  UserPermission.create(req.body, (err, userPermission) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(userPermission);
    }
  });
};
export const deleteOne = (req, res) => {
  UserPermission.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send({
        success: true
      });
    }
  });
};

export const find = (req, res) => {
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
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
  delete rquery.page;
  delete rquery.limit;
  UserPermission.paginate(req.query, options, (err, userPermissions) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(userPermissions);
    }
  });
};
