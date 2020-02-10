import Log from "../models/log";
import ntype from "normalize-type";

export const create = (req, res, next) => {
  let log = new Log();
  Object.assign(log, req.body);

  // let idx = req.ip.lastIndexOf(':');
  log.ip = req.headers["x-forwarded-for"];
  log.userAgent = req.get("User-Agent");
  log.user = req.user._id;
  log.save((err, item) => {
    if (err) {
      res.status(500).end(err);
    } else {
      res.send(item);
    }
  });
};
export const get = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;
  let query = { ...rquery };
  Log.paginate(query, options, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const find = (req, res, next) => {
  const { q } = req.param;
  const query = {
    $or: [{ name: { $regex: q, $options: "i" } }, { module: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }]
  };

  Log.paginate(query, {}, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const getOne = (req, res, next) => {
  Log.findById(req.params.id, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else if (item) {
      res.send(item);
    } else {
      res.status(404).send({ msg: "item not found" });
    }
  });
};
