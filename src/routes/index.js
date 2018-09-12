const routes = require('express').Router();



const auth = require('./auth/auth');
routes.use('/auth', auth);

const users = require('./users/users');
routes.use('/users', users);

const business = require('./business/business');
routes.use('/business', business);


module.exports = routes;
