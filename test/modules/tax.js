import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';

let taxId;
export default {
  create: () =>
    it('CREATE tax', done => {
      axios
        .post(api.tax.main, {
          name: 'test tax',
          number: 19
        })
        .then(res => {
          taxId = res.data._id;
          res.should.have.status(200);
          res.data.should.be.a('object');
          global.taxId = res.data._id;
          done();
        })
        .catch(err => {
          console.log(err);
          // console.log(err.response.status);
          // console.log(err.response.statusText);
        });
    }),
  list: () =>
    it('LIST ALL taxs', done => {
      axios(api.tax.main)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          // console.log(err);
          console.log(err.response.status);
          console.log(err.response.statusText);
        });
    }),
  update: () =>
    it('UPDATE a tax', done => {
      axios
        .put(api.tax.main + taxId, {
          name: 'test tax updated',
          number: 23
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
    })
};
