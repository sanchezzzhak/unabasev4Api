const express = require('express');
const auth = express.Router();
const ctl = require('./controller');

const passport = require('passport');
/*
{
	get--/ list of  = require('../controllers/user')
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.post('/signup', ctl.signup)

// auth.post('/login', passport.authenticate('local-login', {
//   successRedirect: '/', failureRedirect: '/auth/login', failureFlash: true
// }), ctl.login)

// auth.get('/login', (req, res,next)=>{
//   console.log(req.msg)
//   // console.log(data)
//   console.log(next)
//   res.send(req.msg)
// })

auth.post('/login', ctl.login)


// auth.post('/connect/local', ctl.connectLocal)
// auth.post('/connect/google', ctl.connectGoogle)

module.exports = auth;