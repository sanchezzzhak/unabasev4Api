import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';

let currencyId;
let data = {
  name: 'test currency name',
  decimal: ',',
  thousand: '.',
  prefix: '$',
  suffix: '.',
  presicion: 2
};

export default {
  create: () =>
    it('CREATE a @currency', done => {
      axios
        .post(api.currency.main, {
          name: data.name,
          decimal: data.decimal,
          thousand: data.thousand,
          prefix: data.prefix,
          suffix: data.suffix,
          precision: data.precision
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          currencyId = res.data._id;
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
    it('LIST all currencies @currency', done => {
      axios(api.currency.main)
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
  update: () =>
    it('UPDATE  a @currency', done => {
      axios
        .put(api.currency.main + currencyId, {
          name: data.name + 'updated',
          decimal: data.decimal,
          thousand: data.thousand,
          prefix: data.prefix,
          suffix: data.suffix,
          precision: data.precision
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
    it('FIND BY QUERY currencies - name @currency', done => {
      axios(`${api.currency.find}/${data.name.slice(3, 7)}`)
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
    it('GET ONE currency by id @currency', done => {
      axios(api.currency.main + currencyId)
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
