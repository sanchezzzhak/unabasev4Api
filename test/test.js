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
import income from './modules/income';
import tax from './modules/tax';
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

describe('Income***************************************', () => {
  income.create();
  income.list();
  income.update();
});

describe('Tax***************************************', () => {
  tax.create();
  tax.list();
  tax.update();
});
