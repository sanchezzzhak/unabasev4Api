import { Router } from "express";
import logger from "../lib/logger";
const router = Router();
import { get, find, update, create } from "../controllers/permission";
let module = "permission";

// router

//HECTOR -  USUARIOS QUE TIENEN UN PERMISO DENTRO DE LA EMPRESA (ESPECIFICO)
router.get(
  "/users/:businessId/:permissionId",
  logger({
    name: "find list users by permission",
    description: "find list of users by permission",
    module
  }),
  findUsersByPermission
);

router.get(
  "/:id",
  logger({
    name: "get one permission by id",
    description: "get one permission by id",
    module
  }),
  get
);

router.get(
  "/",
  logger({
    name: "find list of permission",
    description: "find list of permission",
    module
  }),
  find
);

router.post(
  "/",
  logger({
    name: "create permission",
    description: "create permission",
    module
  }),
  create
);

router.put(
  "/:id",
  logger({
    name: "update permission",
    description: "update permission",
    module
  }),
  update
);

export default router;
