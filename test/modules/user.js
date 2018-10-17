import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import { assert } from 'chai';
const should = _should();
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';
// let userId;
let data = {
  password: 'test123'
};

export default {
  create: () =>
    it('it should create a user', done => {
      axios
        .post(api.user.main, {
          name: 'test user',
          username: 'test username',
          password: data.password,
          idnumber: '255456562',
          phones: {
            default: '+56909909909'
          },
          emails: {
            default: 'test@mail.com'
          },
          address: {
            street: 'carmen covarrubias',
            number: 32,
            district: 'ñuñoa',
            city: 'Santiago',
            region: 'Metropolitana',
            country: 'Chile'
          }
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.type.should.equal('personal');
          // userId = res.data._id;
          global.userId = res.data._id;
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),
  list: () =>
    it('it should list all users', done => {
      axios
        .get(api.user.main + `?accountType=personal`)
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.docs.should.be.a('array');
          res.data.total.should.be.a('number');
          res.data.limit.should.be.a('number');
          res.data.page.should.be.a('number');
          res.data.pages.should.be.a('number');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),
  update: () =>
    it('it should update a user', done => {
      axios
        .put(api.user.main + global.userId, {
          name: 'test user updated',
          username: 'test username updated',
          idnumber: '9999999991',
          phones: {
            default: '+56707707707'
          },
          emails: {
            default: 'testupdated@mail.com'
          },
          address: {
            street: 'carmen covarrubias updated',
            number: 64,
            district: 'ñuñoa updated',
            city: 'Santiago updated',
            region: 'Metropolitana updated',
            country: 'Chile updated'
          }
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.type.should.equal('personal');
          done();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.status);
            console.log(err.response.statusText);
            console.log(err.response.data);
          } else console.log(err);
        });
    }),
  password: () =>
    it('it should change a user password', done => {
      axios
        .put(api.user.password + global.userId, {
          password: data.password,
          newPassword: 'changedpassword123'
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
            console.log(err.response.data);
          } else console.log(err);
        });
    })
};
