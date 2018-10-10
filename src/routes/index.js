import express from 'express';
const routes = express.Router();
import authConfig from '../config/lib/auth';

routes.get('/', authConfig.sToken, (req, res) => {
  res.send({ msg: 'Unabase api' });
});

routes.get('/isAuth', authConfig.isAuth, (req, res) => {
  res.statusMessage = 'authenticated';
  res.send(req.user.getUser());
});

import auth from './auth/auth';
routes.use('/auth', auth);

import users from './users/users';
routes.use('/users', users);

import business from './business/business';
routes.use('/business', business);

import incomes from './incomes/incomes';
routes.use('/incomes', incomes);

import taxs from './taxs/taxs';
routes.use('/taxs', taxs);

import items from './items/items';
import { from } from 'apollo-link';
routes.use('/items', items);

export default routes;
