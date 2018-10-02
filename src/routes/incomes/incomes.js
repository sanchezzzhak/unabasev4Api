const express = require("express");
const incomes = express.Router();
const ctl = require("./controller");
// const cToken = require("../../config/lib/auth").cToken;
// const isAuth = require("../../config/lib/auth").isAuth;
// incomes.use(isAuth);

incomes.get("/", ctl.get);
// incomes.get('/', ctl.filter)
incomes.get("/:id", ctl.getOne);
incomes.post("/", ctl.create);
incomes.patch("/:id", ctl.updateOne);

module.exports = incomes;
