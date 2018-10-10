import Tax from '../../models/tax';
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
    Tax.findOne({ id: req.params.id }, (err, tax) => {
      if (err) {
        res.status(404).end(err);
      } else {
        res.send(tax);
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
  updateOne() {},
  findOne(req, res) {
    let query = {
      $and: []
    };
    Object.keys(req.query).forEach(q => {
      query.$and.push({ [q]: { $regex: req.query[q], $options: 'i' } });
    });

    Tax.findOne(query, (err, tax) => {
      if (err) {
        res.status(500).end();
      } else if (tax) {
        res.send(tax);
      } else {
        res.status(404).end();
      }
    });
  }
};
