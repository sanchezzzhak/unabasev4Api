import Item from '../models/item';
import ntype from 'normalize-type';
const routes = {
  get(req, res) {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    options.populate = [
      {
        path: 'tax',
        select: 'number name'
      }
    ];
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery, creator: req.user._id };
    Item.paginate(query, options, (err, taxs) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(taxs);
      }
    });
  },
  getOne(req, res) {
    Item.findById(req.params.id)
      .populate({ path: tax })
      .exec((err, item) => {
        if (err) {
          console.log(err);
          res.status(500).end(err);
        } else if (item) {
          res.send(item);
        } else {
          res.status(404).end();
        }
      });
  },
  create(req, res) {
    Item.findOne(
      { name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } },
      (err, itemFound) => {
        if (err) {
          console.log(err);
          res.status(500).end({ err });
        } else if (itemFound) {
          res.send(itemFound);
        } else {
          let item = new Item(req.body);
          item.creator = req.user._id;
          item.save((err, itemSaved) => {
            if (err) {
              console.log(err);
              res.status(500).end({ err });
            } else {
              res.send(itemSaved);
            }
          });
        }
      }
    );
  },
  updateOne(req, res) {
    Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, item) => {
        if (err) {
          res.status(500).end(err);
        } else {
          res.send(item);
        }
      }
    );
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
