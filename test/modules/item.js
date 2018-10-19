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
    it('it should create an item', function(done) {
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
    it('it should find all items', function(done) {
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
    it('it should update an item', function(done) {
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
    it('it should find item', done => {
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
    })
};
