import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';
let data = {
  name: 'test tax name',
  number: 17
};
let taxId;
export default {
  create: () =>
    it('CREATE tax @tax', done => {
      axios
        .post(api.tax.main, {
          name: data.name,
          number: data.number
        })
        .then(res => {
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
    it('LIST ALL taxs @tax', done => {
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
    it('UPDATE a tax @tax', done => {
      axios
        .put(api.tax.main + global.taxId, {
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
    }),
  find: () =>
    it('FIND BY QUERY - name @tax', done => {
      axios(`${api.tax.find}/${data.name.slice(3, 7)}`)
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
    it('GET ONE tax by id @tax', done => {
      axios(api.tax.main + global.taxId)
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
