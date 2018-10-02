const express = require('express');
const outcomes = express.Router();
const ctl = require('./controller');
const cToken = require('../../config/lib/auth').cToken;
users.use(cToken)

/*
{
	get--/ list of  = require('../controllers/user')
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.get('/', ctl.gets)
users.post('/', ctl.getFilter)
users.get('/:id', ctl.get)
users.put('/', ctl.update)

module.exports = outcomes;