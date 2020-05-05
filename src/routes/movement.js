import { Router } from "express";
const router = Router();
import {
  get,
  getPersonal,
  getBusiness,
  create,
  getOne,
  findOne,
  find,
  updateOne,
  getRelated,
  byItem,
  createExpense,
  getByClientLine,
  createRequest,
  nullMany,
  updateState
} from "../controllers/movement";
import { isAuth } from "../config/lib/auth";
import logger from "../lib/logger";
import { checkPermission } from "../middleware/permission";
import { validateParams } from "../middleware/validate";
import { detector } from "../middleware/device";
let module = "movement";
// if (process.env.NODE_ENV !== 'test') {

router.get(
  "/:id",
  logger({
    name: "get one movement by id",
    description: "get one movement by id",
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

// }

router.get(
  "/",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  get
);
router.get(
  "/related/:id",
  logger({
    name: "list movements with related contact",
    description: "get the list of movements with related contact",
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
  getRelated
);
router.get(
  "/personal/:state",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  validateParams(
    [
      {
        param_key: "state",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  getPersonal
);
router.get(
  "/business/:state/:id",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  validateParams(
    [
      {
        param_key: "state",
        required: true,
        type: "string"
      },
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  getBusiness
);
// router.get(
//   '/business/:state',
//   logger({
//     name: 'list movements',
//     description: 'get the list of movements',
//     module
//   }),
//   get
// );
// router.get('/', filter)
router.get(
  "/findOne",
  logger({
    name: "create movement",
    description: "create movement",
    module
  }),
  findOne
);
router.get(
  "/find/:q",
  logger({
    name: "create movement",
    description: "create movement",
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
router.get(
  "/item/:id",
  logger({
    name: "find movements by item",
    description: "find movements by item",
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
  byItem
);

router.post(
  "/",
  checkPermission({ permission: { module, action: "create" } }),
  logger({
    name: "create movement",
    description: "create movement",
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
        param_key: "state",
        enum: ["request", "opportunity", "business"],
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
      }
    ],
    "body"
  ),
  updateOne
);
router.post(
  "/expense",

  validateParams(
    [
      {
        param_key: "movement",
        required: true,
        type: "string"
      },
      {
        param_key: "lines",
        required: true,
        type: "array"
      }
    ],
    "body"
  ),
  createExpense
);
router.post(
  "/expense/:state",
  validateParams(
    [
      {
        param_key: "movement",
        required: true,
        type: "string"
      },
      {
        param_key: "lines",
        required: true,
        type: "array"
      },
      {
        param_key: "providers",
        required: true,
        type: "array"
      }
    ],
    "body"
  ),
  validateParams(
    [
      {
        param_key: "state",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  createRequest
);

router.get(
  "/line/client/:id",
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
  getByClientLine
);
router.put(
  "/null/many",
  validateParams(
    [
      {
        param_key: "movements",
        required: true,
        type: "array"
      }
    ],
    "body"
  ),
  nullMany
);
router.put(
  "/:id/:action",
  validateParams(
    [
      {
        param_key: "state",
        required: true,
        type: "string"
      },
      {
        param_key: "clientLine",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      },
      {
        param_key: "action",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  updateState
);

export default router;
