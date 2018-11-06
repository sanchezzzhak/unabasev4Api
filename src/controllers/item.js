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
  getOne(req, res) {
    Item.findById(req.params.id, (err, item) => {
      if (err) {
        res.status(500).end(err);
      } else if (item) {
        res.send(item);
      } else {
        res.status(404).end();
      }
    });
  },
  create(req, res) {
    let item = new Item();
    let { name, tax } = req.body;
    item.name = name;
    item.tax = tax;
    item.save((err, itemSaved) => {
      if (err) {
        console.log(err);
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
  find: (req, res) => {
    let query = {
      name: { $regex: req.params.q, $options: 'i' }
    };
    Item.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(items);
      }
    });
  }
};

module.exports = routes;
