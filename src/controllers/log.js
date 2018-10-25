import Log from '../models/log';
import ntype from 'normalize-type';

export default {
  create: (req, res) => {
    let log = new Log();
    Object.assign(log, req.body);

    let idx = req.ip.lastIndexOf(':');
    log.ip = req.ip.substring(idx + 1, req.ip.length);
    log.userAgent = req.get('User-Agent');
    log.user = req.user._id;
    log.save((err, item) => {
      if (err) {
        res.status(500).end(err);
      } else {
        res.send(item);
      }
    });
  },
  get: (req, res) => {
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
  },
  find: (req, res) => {
    const { q } = req.param;
    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { module: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    Log.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(items);
      }
    });
  },
  getOne: (req, res) => {
    Log.findById(req.params.id, (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else if (item) {
        res.send(item);
      } else {
        res.status(404).send({ msg: 'item not found' });
      }
    });
  }
};
