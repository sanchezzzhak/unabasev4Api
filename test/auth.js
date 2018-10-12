const User = require('../build/models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const server = require('../build/app');
const assert = require('chai').assert;

const axios = require('axios');

const api = require('../build/config/api');
const should = chai.should();
chai.use(chaiHttp);
const username = Math.random().toString(36);

describe('Auth/register/login***************************************', () => {
  describe('/POST User', () => {
    it('it should register a user', done => {
      axios
        .post(api.auth.register, {
          username,
          password: 'testpass',
          email: 'text@mail.com'
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          console.log(err.response.status);
          console.log(err.response.statusText);
        });
    });
  });
  describe('/Post login', () => {
    it('it should login', done => {
      axios
        .post(api.auth.login, {
          username,
          password: 'testpass'
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          res.data.should.have.property('token');
          res.data.should.have.property('user');
          done();
        })
        .catch(err => {
          console.log(err.response.status);
          console.log(err.response.statusText);
        });
    });
  });
});
