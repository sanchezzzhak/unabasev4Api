import { Router } from "express";
const users = Router();

import { create, get, logout, find, getOne, password, update, business, scope, user, restart, relationsFind, lastItems, lastParents } from "../controllers/user";

import { sToken } from "../config/lib/auth";
users.post("/", create);
users.use(sToken);

/*
{
	get--/ 
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.put("/password", password);

users.get("/", get);
users.get("/lastItems", lastItems);
users.get("/lastParents", lastParents);
users.get("/logout", logout);
users.get("/find/:q", find);
users.get("/relations/:q", relationsFind);
users.get("/:id", getOne);
users.post("/restart/:q", restart);
users.put("/business/:id", business);
users.put("/user/:id", user);
users.put("/scope/:id", scope);
users.put("/:id", update);

export default users;
