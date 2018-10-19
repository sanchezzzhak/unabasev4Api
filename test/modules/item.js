import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';

let itemId;
let data = {
  name: 'test item name'
};

export default {
  create: () =>
    it('CREATE an item', function(done) {
      axios
        .post(api.item.main, {
          name: data.name,
          tax: global.taxId
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          itemId = res.data._id;
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    }),
  list: () =>
    it('LIST ALL items', function(done) {
      axios(api.item.main)
        .then(res => {
          // console.log(res.data);
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.docs.should.be.a('array');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    }),

  update: () =>
    it('UPDATE an item', function(done) {
      axios
        .put(api.item.main + itemId, {
          name: 'test item updated',
          tax: global.taxId
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    }),
  find: () =>
    it('FIND BY QUERY items ', done => {
      axios(api.item.find + `?query=${data.name.slice(3, 7)}`)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.docs.should.be.a('array');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    }),
  getOne: () =>
    it('GET ONE item by id', done => {
      axios(api.item.main + itemId)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
          } else console.log(err);
        });
    })
};
