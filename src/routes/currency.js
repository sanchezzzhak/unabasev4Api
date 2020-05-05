import { Router } from "express";
import { validateParams } from "../middleware/validate";
const router = Router();

import { get, create, updateOne, find, getOne, deleteOne } from "../controllers/currency";

import logger from "../lib/logger";

let module = "currencies";
router.get(
  "/",
  logger({
    name: "list currencies",
    description: "list currencies",
    module
  }),
  get
);
router.get(
  "/:id",
  logger({
    name: "get one",
    description: "get one currency by id",
    module
  }),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  getOne
);
router.post(
  "/",
  logger({
    name: "create",
    description: "create currency",
    module
  }),
  validateParams(
    [
      {
        param_key: "name",
        required: true,
        type: "string"
      },
      {
        param_key: "decimal",
        required: true,
        type: "string"
      },
      {
        param_key: "thousand",
        required: true,
        type: "string"
      },
      {
        param_key: "countryOrigin",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  create
);
router.put(
  "/:id",
  logger({
    name: "update",
    description: "update currency",
    module
  }),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  validateParams(
    [
      {
        param_key: "name",
        required: false,
        type: "string"
      },
      {
        param_key: "decimal",
        required: false,
        type: "string"
      },
      {
        param_key: "thousand",
        required: false,
        type: "string"
      },
      {
        param_key: "countryOrigin",
        required: false,
        type: "string"
      }
    ],
    "body"
  ),
  updateOne
);
router.get(
  "/find/:q",
  logger({
    name: "find",
    description: "find currencies",
    module
  }),
  validateParams(
    [
      {
        param_key: "q",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  find
);
router.delete(
  "/:id",
  logger({
    name: "delete",
    description: "delete currency",
    module
  }),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  deleteOne
);

export default router;
