const business = require('express').Router();
const ctl = require('./controller');
const cToken = require('../../config/lib/auth').cToken;
business.use(cToken)

business.get('/', ctl.get);
business.post('/', ctl.gets);
business.post('/create', ctl.create);
business.get('/:_id', ctl.getOne);
business.put('/:_id', ctl.update)
// business



module.exports = business;



