import express from 'express';
const routes = express.Router();
import authConfig from '../config/lib/auth';

routes.get('/', (req, res) => {
  res.send({ msg: `Unabase api. ${process.env.NODE_ENV}` });
});

routes.get('/tzxax', (req, res) => {
  res.send({ msg: `Unabase api. ${process.env.NODE_ENV}` });
});

routes.get('/isAuth', authConfig.sToken, (req, res) => {
  res.statusMessage = 'authenticated';
  res.send(req.user.getUser());
});

import auth from './auth';
routes.use('/auth', auth);

import user from './user';
routes.use('/users', user);

import business from './business';
routes.use('/business', business);

import movement from './movement';
routes.use('/movements', movement);

import tax from './tax';
routes.use('/taxs', tax);

import item from './item';
routes.use('/items', item);

import currency from './currency';
routes.use('/currencies', currency);

import mailer from './mailer';
routes.use('/mailer', mailer);

import log from './log';
routes.use('/logs', log);

export default routes;
