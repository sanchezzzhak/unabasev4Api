import { Router } from "express";
const router = Router();
import logger from "../lib/logger";

import { get, create, updateOne, findOne, getOne, find } from "../controllers/item";
let module = "items";
router.get(
  "/",
  logger({
    name: "list",
    description: "list items",
    module
  }),
  get
);
router.post(
  "/",
  logger({
    name: "create",
    description: "create item",
    module
  }),
  create
);
router.put(
  "/:id",
  logger({
    name: "update",
    description: "update item",
    module
  }),
  updateOne
);
router.get(
  "/find/:q",
  logger({
    name: "find",
    description: "find items",
    module
  }),
  find
);
router.get(
  "/:id",
  logger({
    name: "getOne",
    description: "get one item",
    module
  }),
  getOne
);

export default router;
