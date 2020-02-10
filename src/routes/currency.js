import { Router } from "express";
const currencies = Router();

import { get, create, updateOne, find, getOne, deleteOne } from "../controllers/currency";

import logger from "../lib/logger";
import { sToken } from "../config/lib/auth";
currencies.use(sToken);
let module = "currencies";
currencies.get(
  "/",
  logger({
    name: "list currencies",
    description: "list currencies",
    module
  }),
  get
);
currencies.get(
  "/:id",
  logger({
    name: "get one",
    description: "get one currency by id",
    module
  }),
  getOne
);
currencies.post(
  "/",
  logger({
    name: "create",
    description: "create currency",
    module
  }),
  create
);
currencies.put(
  "/:id",
  logger({
    name: "update",
    description: "update currency",
    module
  }),
  updateOne
);
currencies.get(
  "/find/:q",
  logger({
    name: "find",
    description: "find currencies",
    module
  }),
  find
);
currencies.delete(
  "/:id",
  logger({
    name: "delete",
    description: "delete currency",
    module
  }),
  deleteOne
);

export default currencies;
