// @ts-nocheck
import ntype from 'normalize-type';
import Contact from '../models/contact';
import Business from '../models/business';
import User from '../models/user';
import business from '../routes/business';
export default {
  create: (req, res) => {
    Business.findOne({ idnumber: req.body.idnumber }, (err, business) => {
      if (err) throw err;

      if (business) {
        res.status(409).send({
          msg: 'Business already exist'
        });
      } else if (typeof req.body.idnumber === 'undefined') {
        res.send({
          msg: 'You must enter an id number'
        });
      } else {
        let newBusiness = new Business(req.body);

        newBusiness.save((err, business) => {
          if (err) res.status(500).end({ err });
          else {
            let contact = new Contact();
            contact.name = business.name;
            contact.type = 'Business';
            contact.link = business._id;
            contact.save();

            res.send(business);
          }
        });
      }
    });
  },
  getOne: (req, res) => {
    Business.findOne({ _id: req.params.id }, (err, business) => {
      if (err) {
        res.status(500).send(err);
      } else if (business) {
        res.send(business);
      } else {
        res.status(404).end('business not found');
      }
    });
  },
  updateOne: (req, res) => {
    Business.findOneAndUpdate(
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
  get: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;

    Business.paginate(rquery, options, (err, item) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(item);
      }
    });
  },
  user: (req, res) => {
    const action = req.body.action === 'add' ? '$addToSet' : '$pull';
    let update = {
      [action]: { users: req.body.user }
    };

    Business.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true },
      (err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          User.findByIdAndUpdate(
            req.body.user,
            {
              [action]: { business: item._id }
            },
            { new: true },
            (err, user) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.send(item);
              }
            }
          );
        }
      }
    );
  }
};
