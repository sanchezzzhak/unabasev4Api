import { Router } from "express";
import logger from "../lib/logger";
const router = Router();

import { create, deleteOne, deleteOneById, find } from "../controllers/userPermission";
let module = "userPermission";

router.post(
  "/",
  logger({
    name: "create user permission",
    description: "create user permission",
    module
  }),
  create
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
  "/:id",
  logger({
    name: "delete permission of the user",
    description: "delete permission of the user",
    module
  }),
  deleteOneById
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

export default router;
