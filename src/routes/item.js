import { Router } from "express";
const items = Router();
import { sToken } from "../config/lib/auth";
import logger from "../lib/logger";

items.use(sToken);
import { get, create, updateOne, findOne, getOne, find } from "../controllers/item";
let module = "items";
items.get(
  "/",
  logger({
    name: "list",
    description: "list items",
    module
  }),
  get
);
items.post(
  "/",
  logger({
    name: "create",
    description: "create item",
    module
  }),
  create
);
items.put(
  "/:id",
  logger({
    name: "update",
    description: "update item",
    module
  }),
  updateOne
);
items.get(
  "/find/:q",
  logger({
    name: "find",
    description: "find items",
    module
  }),
  find
);
items.get(
  "/:id",
  logger({
    name: "getOne",
    description: "get one item",
    module
  }),
  getOne
);

export default items;
