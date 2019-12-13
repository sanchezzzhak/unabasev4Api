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
export const deleteOneById = (req, res) => {
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
export const deleteOne = (req, res) => {
  const { business, user, permission } = req.body;
  if (user && business && permission) {
    UserPermission.deleteOne({ business, user, permission }, err => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.send({
          success: true
        });
      }
    });
  } else {
    res.status(500).end("the data is not enough");
  }
};

export const find = (req, res) => {
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
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(userPermissions);
    }
  });
};
