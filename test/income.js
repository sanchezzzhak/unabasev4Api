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
let incomeId;
let linesIds;
describe('Incomes***************************************', () => {
  it('it should create an income', function(done) {
    axios
      .post(api.income.main, {
        name: 'test inc',
        description: 'test desc incm',
        dates: {
          expiration: new Date()
        },
        // client: '',
        lines: [
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
        currency: '5bbe5c8b2edaed42baf2b6c1'
      })
      .then(res => {
        incomeId = res.data._id;
        res.should.have.status(200);
        res.data.should.be.a('object');
        linesIds = res.data.lines;
        done();
      })
      .catch(err => {
        console.log(err.response.status);
        console.log(err.response.statusText);
      });
  });
  it('it should find all incomes', function(done) {
    axios(api.income.main)
      .then(res => {
        // console.log(res.data);
        res.should.have.status(200);
        res.data.should.be.a('object');
        done();
      })
      .catch(err => {
        console.log(err.response.status);
        console.log(err.response.statusText);
      });
  });

  it('it should update an income', function(done) {
    console.log(api.income.main + incomeId);
    axios
      .put(api.income.main + incomeId, {
        name: 'test inc updated',
        description: 'test desc incm updated',
        dates: {
          expiration: new Date()
        },
        // client: '',
        lines: [
          {
            _id: linesIds[0],
            name: 'tomate333',
            tax: '5bbe5c732edaed42baf2b6c0',
            quantity: 76,
            price: 1000000,
            item: '5bbe5c8f2edaed42baf2b6c2'
          },
          {
            _id: linesIds[1],
            name: 'cebolla333',
            tax: '5bbe5c732edaed42baf2b6c0',
            quantity: 23,
            price: 500999,
            item: '5bbe5c682edaed42baf2b6bf'
          },
          {
            _id: linesIds[2],
            name: 'papa333',
            tax: '5bbe5c732edaed42baf2b6c0',
            quantity: 56,
            price: 500666,
            item: '5bbe5c8b2edaed42baf2b6c1'
          }
        ],
        total: {
          net: 5000,
          tax: 5950
        },
        state: 'draft',
        currency: '5bbe5c8b2edaed42baf2b6c1'
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
  });
});
