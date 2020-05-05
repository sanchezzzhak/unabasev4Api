// imports for routing, logging and controllers
import { Router } from "express";
import logger from "../lib/logger";
import { create, get, find, update, apply } from "../controllers/role";
import { isAuth } from "../config/lib/auth";
const router = Router();
let module = "Role";

router.get(
  "/:id",
  logger({
    name: "get a role",
    description: "get a role",
    module
  }),
  get
);

router.get(
  "/",
  logger({
    name: "find list of roles",
    description: "find list of roles",
    module
  }),
  find
);

router.post(
  "/",
  logger({
    name: "create role",
    description: "create role",
    module
  }),
  create
);
router.post(
  "/apply",
  logger({
    name: "apply role",
    description: "apply role",
    module
  }),
  apply
);

router.put(
  "/:id",
  logger({
    name: "update role",
    description: "update role",
    module
  }),
  update
);

export default router;
