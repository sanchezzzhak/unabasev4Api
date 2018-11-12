import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import { assert } from 'chai';
const should = _should();
import axios from 'axios';
use(chaiHttp);
// import api from '../src/config/api/index';
import user from './modules/user';
import business from './modules/business';
import auth from './modules/auth';
import movement from './modules/movement';
import tax from './modules/tax';
import item from './modules/item';
import currency from './modules/currency';
import mailer from './modules/mailer';

import api_doc from 'unabase_api_doc';

const api = api_doc(process.env.NODE_ENV);
console.log(api.user.main);
let userId;
// global.userId = '';
let data = {
  password: 'test123'
};

describe('Auth***************************************', () => {
  auth.register(api);
  auth.login(api);
});

describe('User***************************************', () => {
  user.create(api);
  user.list(api);
  user.update(api);
  user.password(api);
  user.getOne(api);
  user.find(api);
});

describe('Business***************************************', () => {
  business.create(api);
  business.list(api);
  business.update(api);
  business.password(api);
  business.user(api);
});

describe('Tax***************************************', () => {
  tax.create(api);
  tax.list(api);
  tax.update(api);
  tax.find(api);
  tax.getOne(api);
});

describe('Item***************************************', () => {
  item.create(api);
  item.list(api);
  item.update(api);
  item.find(api);
  item.getOne(api);
});

describe('Currency***************************************', () => {
  currency.create(api);
  currency.list(api);
  currency.update(api);
  currency.find(api);
  currency.getOne(api);
});

describe('Movement***************************************', () => {
  movement.create(api);
  movement.list(api);
  movement.update(api);
  movement.null(api);
  movement.find(api);
  movement.getOne(api);
});

describe('Mailer***********************************', () => {
  mailer.sendFunc(api);
  mailer.send(api);
});
