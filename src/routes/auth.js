import axios from "axios";
import { Router } from "express";
import jwt from "jsonwebtoken";
import gauth from "../config/auth";
import { verify, register, password, login, google, googleCallback, errUser } from "../controllers/auth";
import User from "../models/user";
import logger from "../lib/logger";
// import passport from "../config/passport";
import passport from "passport";
const auth = Router();
let module = "auth";
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.put(
  "/verify/:id",
  logger({
    name: "verify",
    description: "verify a user with local strategy",
    module
  }),
  verify
);

auth.post(
  "/register",
  logger({
    name: "register",
    description: "register a user with local strategy",
    module
  }),
  register
);

auth.post(
  "/password/:id",
  logger({
    name: "restart password",
    description: "restart a password",
    module
  }),
  password
);

// auth.get('/errUser', errUser);

auth.post(
  "/login",
  logger({
    name: "login",
    description: "login a user with local strategy",
    module
  }),
  login
);

auth.post("/login2", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login2" }));

auth.get("/google", passport.authenticate("google", { scope: ["profile", "email", "openid", "https://www.googleapis.com/auth/calendar.events"] }));

auth.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login2" }), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect("/");
});

// auth.post('/google/register', google.register);
auth.post("/google", google);
export default auth;
