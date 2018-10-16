// process.env.NODE_ENV = 'test';

// import mongoose from 'mongoose';

// import Income from '../src/models/income';

// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../build/app';

const Income = require('../build/models/income');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const server = require('../build/app');
const assert = require('chai').assert;
// const request = require('request');
const should = chai.should();
const axios = require('axios');
chai.use(chaiHttp);
const api = require('../build/config/api');

describe('Incomes***************************************', () => {
  describe('/get incomes', () => {
    it('it should find all incomes', function(done) {
      axios(api.income.main)
        .then(res => {
          // console.log(res.data);
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
  describe('/create income', () => {
    it('it should create an income', function(done) {
      axios
        .post(api.income.main, {
          name: 'test inc',
          description: 'test desc incm',
          dates: {
            expiration: new Date()
          },
          // client: '',
          // creator: '',
          items: [
            {
              name: 'tomate',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 2,
              price: 500,
              item: '5bbe5c8f2edaed42baf2b6c2'
            },
            {
              name: 'cebolla',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 2,
              price: 500,
              item: '5bbe5c682edaed42baf2b6bf'
            },
            {
              name: 'papa',
              tax: '5bbe5c732edaed42baf2b6c0',
              quantity: 2,
              price: 500,
              item: '5bbe5c8b2edaed42baf2b6c1'
            }
          ],
          total: {
            net: 5000,
            tax: 5950
          },
          state: 'draft',
          currency: 
        })
        .then(res => {
          res.should.have.status(200);
          res.data.should.be.a('object');
          done();
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});
