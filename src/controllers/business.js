// @ts-nocheck

import Business from '../models/business';
import User from '../models/user';
export default {
  create: (req, res) => {
    Business.findOne({ idnumber: req.body.idnumber }, (err, business) => {
      if (err) throw err;

      if (business) {
        res.statusMessage = 'Business already exist';
        res.status(200).end();
        res.send({
          msg: 'Business already exist'
        });
      } else if (typeof req.body.idnumber === 'undefined') {
        res.send({
          msg: 'You must enter an id number'
        });
      } else {
        let nBusiness = new Business();
        nBusiness.idnumber = req.body.idnumber;
        nBusiness.legalName = req.body.legalName || '';
        nBusiness.name = req.body.name || '';
        nBusiness.businessType = req.body.businessType || '';
        nBusiness.website = req.body.website || '';
        req.body.admins.forEach(el => {
          nBusiness.admins.push(el);
        });
        req.body.phones.forEach(el => {
          nBusiness.phones.push(el);
        });
        req.body.emails.forEach(el => {
          nBusiness.emails.push(el);
        });
        nBusiness.creator = req.user._id;
        nBusiness.address.street = req.body.street;
        nBusiness.address.number = req.body.number;
        nBusiness.address.district = req.body.district;
        nBusiness.address.city = req.body.city;
        nBusiness.address.region = req.body.region;
        nBusiness.address.country = req.body.country;
        nBusiness.save((err, business) => {
          if (err) throw err;
          else res.send(business);
        });
      }
    });
  },
  getOne: (req, res) => {
    Business.findOne({ _id: req.params._id }, (err, business) => {
      if (err) {
        throw err;
      }
      if (business) {
        res.send(business);
      } else {
        res.statusMessage = 'business not found';
        res.status(404).end();
      }
    });
  },
  update: (req, res) => {
    Business.findOne(
      { _id: req.body._id },
      {},
      { new: true },
      (err, business) => {
        if (err) {
          throw err;
        }
        if (business) {
          business.idnumber = req.body.idnumber;
          business.legalName = req.body.legalName || '';
          business.name = req.body.name || '';
          business.businessType = req.body.businessType || '';
          business.website = req.body.website || '';
          business.admins = [];
          business.phones = [];
          business.emails = [];
          req.body.admins.forEach(el => {
            business.admins.push(el);
          });
          req.body.phones.forEach(el => {
            business.phones.push(el);
          });
          req.body.emails.forEach(el => {
            business.emails.push(el);
          });

          business.address.street = req.body.street;
          business.address.number = req.body.number;
          business.address.district = req.body.district;
          business.address.city = req.body.city;
          business.address.region = req.body.region;
          business.address.country = req.body.country;
          business.save((err, businss) => {
            if (err) {
              throw err;
            } else {
              res.send(businss);
            }
          });
        } else {
          res.statusMessage = 'business not found';
          res.status(404).end();
        }
      }
    );
  },
  get: (req, res) => {
    Business.find({}, (err, businesses) => {
      if (err) throw err;
      else {
        res.send(businesses);
      }
    });
  },
  gets: (req, res) => {},

  user: (req, res) => {
    let update = {
      $addToSet: { users: req.body.user }
    };
    User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true },
      (err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(item);
        }
      }
    );
  }
};
