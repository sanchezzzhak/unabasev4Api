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
currencies.post(
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
  create
);
currencies.put(
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
  updateOne
);
currencies.get(
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
currencies.delete(
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

export default currencies;
