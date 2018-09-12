const express = require('express');
const users = express.Router();
const ctl = require('./controller');
const vToken = require('../../config/lib/auth').vToken;
users.use(vToken)

/*
{
	get--/ list of  = require('../controllers/user')
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.get('/', ctl.getUsers)
users.post('/', ctl.postUsers)
users.get('/:id', ctl.getUser)
// users.post('/', ctl.createUser)
users.put('/', ctl.updateUser)

module.exports = users;