import Contact from '../models/contact';

const routes = {
  get: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    const sort = rquery.createdAt
      ? { createdAt: rquery.createdAt }
      : { createdAt: 'desc' };
    options.sort = { ...sort };
    delete rquery.createdAt;
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery, type };
    Contact.paginate(query, options, (err, items) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(items);
      }
    });
  },
  getOne: (req, res) => {
    Contact.findById(req.params.id, (err, item) => {
      if (err) {
        res.status(500).end(err);
      } else if (item) {
        res.send(item);
      } else {
        res.status(404).end();
      }
    });
  },
  create: (req, res) => {
    let contact = new Contact(req.body);
    contact.save((err, item) => {
      if (err) {
        res.status(500).end({ err });
      } else {
        res.send(item);
      }
    });
  },
  find: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
    let query = {
      $or: [
        {
          name: { $regex: req.params.q, $options: 'i' }
        },
        {
          'emails.email': { $regex: req.params.q, $options: 'i' }
        }
      ]
    };
    Contact.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).end({ err });
      } else {
        res.send(items);
      }
    });
  },
  updateOne: (req, res) => {
    Contact.findByIdAndUpdate(req.params.id, req.body, {}, (err, item) => {
      if (err) {
        res.status(500).end({ err });
      } else {
        res.send(item);
      }
    });
  }
};
