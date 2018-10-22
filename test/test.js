import { should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import { assert } from 'chai';
const should = _should();
import axios from 'axios';
use(chaiHttp);
import api from '../src/config/api/index';
import user from './modules/user';
import business from './modules/business';
import auth from './modules/auth';
import movement from './modules/movement';
import tax from './modules/tax';
import item from './modules/item';
import currency from './modules/currency';
let userId;
// global.userId = '';
let data = {
  password: 'test123'
};
describe('User***************************************', () => {
  user.create();
  user.list();
  user.update();
  user.password();
  user.getOne();
  user.find();
});

describe('Business***************************************', () => {
  business.create();
  business.list();
  business.update();
  business.password();
  business.user();
});

describe('Auth***************************************', () => {
  auth.register();
  auth.login();
});

describe('Movement***************************************', () => {
  movement.create();
  movement.list();
  movement.update();
  movement.null();
  movement.find();
  movement.getOne();
});

describe('Tax***************************************', () => {
  tax.create();
  tax.list();
  tax.update();
});

describe('Item***************************************', () => {
  item.create();
  item.list();
  item.update();
  item.find();
  item.getOne();
});
describe('Currency***************************************', () => {
  currency.create();
  currency.list();
  currency.update();
  currency.find();
  currency.getOne();
});
