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
});
