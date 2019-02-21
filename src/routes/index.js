import express from 'express';
const routes = express.Router();
import authConfig from '../config/lib/auth';
import language from '../language';
routes.use(language);

routes.get('/', (req, res) => {
  res.send({ msg: `Unabase api. ${process.env.NODE_ENV}` });
});

routes.get('/isAuth', authConfig.sToken, (req, res) => {
  res.statusMessage = 'authenticated';
  res.send(req.user.getUser());
});
import auth from './auth';
import user from './user';
import business from './business';
import movement from './movement';
import tax from './tax';
import item from './item';
import currency from './currency';
import mailer from './mailer';
import log from './log';
import line from './line';
import comment from './comment';
import contact from './contact';

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/business', business);
routes.use('/movements', movement);
routes.use('/taxes', tax);
routes.use('/items', item);
routes.use('/currencies', currency);
routes.use('/mailer', mailer);
routes.use('/logs', log);
routes.use('/lines', line);
routes.use('/comments', comment);
routes.use('/contacts', contact);
routes.post('/t', (req, res) => {
  res.send({ body: req.body, headers: req.headers });
});

export default routes;
