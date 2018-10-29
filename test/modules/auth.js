// const chai = require('chai');
// const chaiHttp = require('chai-http');
// // const server = require('../build/app');
// const assert = require('chai').assert;

// const axios = require('axios');

// const api = require('../build/config/api');
// const should = chai.should();
// chai.use(chaiHttp);

import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
use(chaiHttp);
import api from '../../src/config/api';
const data = {
  password: 'testpass',
  email: `${Math.random()
    .toString(36)
    .substring(2, 15)}@mail.com`,
  username: `${Math.random()
    .toString(36)
    .substring(2, 15)}`
};

export default {
  register: () =>
    it('REGISTER a user @auth', done => {
      axios
        .post(api.auth.register, {
          username: data.username,
          password: {
            hash: data.password
          },
          email: data.email
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          global.loginId = res.data._id;
          done();
        })
        .catch(err => {
          console.log(err);
          // console.log(err.response.status);
          // console.log(err.response.statusText);
        });
    }),

  login: () =>
    it('LOGIN with username a user @auth', done => {
      axios
        .post(api.auth.login, {
          username: data.username,
          password: {
            hash: data.password
          }
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
    }),
  loginEmail: () =>
    it('LOGIN with email a user @auth', done => {
      axios
        .post(api.auth.login, {
          email: data.email,
          'password.hash': data.password
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
    })
};
