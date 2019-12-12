import Role from "../models/role";

export const create = (req, res) => {
  Role.create(req.body, (err, role) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(role);
    }
  });
};

export const update = (req, res) => {
  Role.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, role) => {
    if (err) {
      console.log(err);
      res.status(500).end();
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
      console.log(err);
      res.status(500).end();
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
        console.log(err);
        res.status(500).end();
      } else {
        res.send(role);
      }
    });
};
