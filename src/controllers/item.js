import Item from '../models/item';
import ntype from 'normalize-type';
const routes = {
  get(req, res) {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery };
    Item.paginate(query, options, (err, taxs) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(taxs);
      }
    });
  },
  getOne(req, res) {},
  create(req, res) {
    let item = new Item();
    let { name, tax } = req.body;
    item.name = name;
    item.tax = tax;
    item.save((err, itemSaved) => {
      if (err) {
        res.status(500).end(err);
      } else {
        res.send(itemSaved);
      }
    });
  },
  updateOne(req, res) {
    Item.findByIdAndUpdate(req.params.id, req.body, {}, (err, item) => {
      if (err) {
        res.status(500).end(err);
      } else {
        res.send(item);
      }
    });
  },
  find(req, res) {
    let query = {
      $or: [{ name: { $regex: req.query.query, $options: 'i' } }]
    };
    let options = {};
    Item.paginate(query, options, (err, item) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(item);
      }
    });
  }
};

module.exports = routes;
