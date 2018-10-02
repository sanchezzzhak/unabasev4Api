const routes = require("express").Router();
const isAuth = require("../config/lib/auth").isAuth;
const cors = require("cors");

routes.options("http://localhost:8080", cors());
routes.get("/", (req, res) => {
  res.send("Unabase api");
});

routes.get("/isAuth", isAuth, (req, res) => {
  res.statusMessage = "authenticated";
  res.send("auth");
});

const auth = require("./auth/auth");
routes.use("/auth", auth);

const users = require("./users/users");
routes.use("/users", users);

const business = require("./business/business");
routes.use("/business", business);
const incomes = require("./incomes/incomes");
routes.use("/incomes", incomes);

module.exports = routes;
