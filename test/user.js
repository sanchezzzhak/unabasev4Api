import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import { assert } from 'chai';
const should = _should();
import axios from 'axios';
use(chaiHttp);
// const api = require('../build/config/api');

// import api from '../src/config/api';
import api from '../src/config/api/index';

let userId;
let data = {
  password: 'test123'
};
describe('User***************************************', () => {
  it('it should list all users', done => {
    axios
      .get(api.user.main)
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
  });
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
        userId = res.data._id;
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });
  it('it should update a user', done => {
    axios
      .put(api.user.main + userId, {
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
        done();
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.status);
          console.log(err.response.statusText);
          console.log(err.response.data);
        } else console.log(err);
      });
  });
  it('it should change a user password', done => {
    axios
      .put(api.user.password + userId, {
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
  });
});
