const express = require("express");
const users = express.Router();
const ctl = require("./controller");
// const cToken = require("../../config/lib/auth").cToken;
const isAuth = require("../../config/lib/auth").isAuth;
users.use(isAuth);

/*
{
	get--/ list of  = require('../controllers/user')
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.get("/", ctl.getUsers);
users.post("/", ctl.postUsers);
users.get("/logout", ctl.logout);
users.get("/find", ctl.findOne);
users.get("/:id", ctl.getUser);
// users.post('/', ctl.createUser)
users.put("/", ctl.updateUser);

module.exports = users;
