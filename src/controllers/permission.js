import Permission from "../models/permission";

export const create = (req, res) => {
  let permission = new Permission(req.body);
  res.send(permission);
};

export const update = (req, res) => {
  Permission.findByIdAndUpdate(req.params.id).exec((err, permission) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(permission);
    }
  });
};

export const get = (req, res) => {
  Permission.findById(req.params.id).exec((err, permission) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(permission);
    }
  });
};

export const find = (req, res) => {
  let options = {};
  options.page = req.query.page || 1;
  options.limit = req.query.limit || 20;
  delete req.query.page;
  delete req.query.limit;
  Permission.paginate(...req.query, options, (err, permissions) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.send(permissions);
    }
  });
};
