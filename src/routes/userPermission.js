import { Router } from "express";
import logger from "../lib/logger";
const router = Router();

import { get, deleteOne, find } from "../controllers/userPermission";
let module = "userPermission";

router.post(
  "/",
  logger({
    name: "create user permission",
    description: "create user permission",
    module
  }),
  get
);

router.get(
  "/",
  logger({
    name: "find list of user permissions",
    description: "find list of user permissions",
    module
  }),
  find
);

router.delete(
  "/",
  logger({
    name: "delete permission of the user",
    description: "delete permission of the user",
    module
  }),
  deleteOne
);
