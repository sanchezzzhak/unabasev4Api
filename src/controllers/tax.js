import Tax from '../models/tax';
import ntype from 'normalize-type';

export default {
  get(req, res) {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery };
    Tax.paginate(query, options, (err, taxs) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(taxs);
      }
    });
  },
  getOne(req, res) {
    console.log(req.params.id);
    Tax.findById(req.params.id, (err, tax) => {
      if (err) {
        res.status(500).end(err);
      } else if (tax) {
        res.send(tax);
      } else {
        res.status(404).send({ msg: 'tax not found' });
      }
    });
  },
  create(req, res) {
    let tax = new Tax();
    let { name, number } = req.body;
    tax.name = name;
    tax.number = number;
    tax.save((err, newTax) => {
      if (err) {
        res.status(500).end(err);
      } else {
        res.send(newTax);
      }
    });
  },
  updateOne: (req, res) => {
    Tax.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (err, item) => {
        if (err) {
          res.status(500).send(err);
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
    Tax.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(items);
      }
    });
  }
};
