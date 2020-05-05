import { Router } from "express";
const router = Router();
import { create, get, updateOne, deleteOne, createMany, updateMany, deleteMany, group, move, createParent, getLinesByMovement, requestBudget } from "../controllers/line";
import { checkItem, updateMovementState, updateTotalMovement, updateItemLastPrice, checkParent, updateOldParent, getCurrencyFromMovement } from "../middleware/line";

import { validateParams } from "../middleware/validate";

import logger from "../lib/logger";

let module = "line";

router.get("/", logger({ name: "list lines", description: "get the list of lines", module }), get);
router.get(
  "/movement/:movement",
  validateParams(
    [
      {
        param_key: "movement",
        required: true,
        type: "string",
        validator_functions: []
      }
    ],
    "params"
  ),
  logger({ name: "get lines by movement", description: "get the list of lines", module }),
  getLinesByMovement
);
router.post(
  "/",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    updateMovementState,
    checkParent
  ],
  validateParams(
    [
      {
        param_key: "currency",
        required: true,
        type: "string",
        validator_functions: []
      },
      {
        param_key: "name",
        required: true,
        type: "string",
        validator_functions: []
      }
    ],
    "body"
  ),
  create
);
router.post(
  "/parent",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    updateMovementState
  ],
  validateParams(
    [
      {
        param_key: "parent",
        required: true,
        type: "object",
        validator_functions: []
      },
      {
        param_key: "children",
        required: false,
        type: "array",
        validator_functions: []
      }
    ],
    "body"
  ),
  createParent
);
router.put(
  "/move",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    updateOldParent
  ],
  validateParams(
    [
      {
        param_key: "movement",
        required: true,
        type: "string",
        validator_functions: []
      },
      {
        param_key: "parent",
        required: false,
        type: "string",
        validator_functions: []
      },
      {
        param_key: "oldParent",
        required: false,
        type: "string",
        validator_functions: []
      },
      {
        param_key: "children",
        required: false,
        type: "array",
        validator_functions: []
      }
    ],
    "body"
  ),
  move
);
router.post(
  "/group",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    checkItem
  ],
  validateParams(
    [
      {
        param_key: "children",
        required: true,
        type: "array",
        validator_functions: []
      }
    ],
    "body"
  ),
  group
);
router.post(
  "/many",

  logger({
    name: "create line",
    description: "create line",
    module
  }),
  updateMovementState,
  checkParent,
  getCurrencyFromMovement,

  validateParams(
    [
      {
        param_key: "lines",
        required: true,
        type: "array",
        validator_functions: []
      },
      {
        param_key: "movement",
        required: true,
        type: "string",
        validator_functions: []
      }
    ],
    "body"
  ),
  createMany
);
router.put(
  "/many",
  logger({
    name: "create line",
    description: "create line",
    module
  }),
  validateParams(
    [
      {
        param_key: "lines",
        required: true,
        type: "array",
        validator_functions: []
      },
      {
        param_key: "data",
        required: false,
        type: "object",
        validator_functions: []
      }
    ],
    "body"
  ),
  updateMany
);
router.delete(
  "/many",
  logger({
    name: "create line",
    description: "create line",
    module
  }),
  validateParams(
    [
      {
        param_key: "totalMovement",
        required: false,
        type: "object",
        validator_functions: []
      },
      {
        param_key: "lines",
        required: true,
        type: "array",
        validator_functions: []
      }
    ],
    "body"
  ),
  deleteMany
);
router.put(
  "/:id",
  logger({
    name: "updateOne lines",
    description: "updateOne line",
    module
  }),
  updateTotalMovement,
  updateItemLastPrice,
  checkParent,

  validateParams(
    [
      {
        param_key: "parent",
        required: false,
        type: "string",
        validator_functions: []
      },
      {
        param_key: "numbers",
        required: false,
        type: "object",
        validator_functions: []
      }
    ],
    "body"
  ),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string",
        validator_functions: []
      }
    ],
    "params"
  ),
  updateOne
);
router.delete(
  "/:id",
  logger({
    name: "delete one line",
    description: "delete one line",
    module
  }),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string",
        validator_functions: []
      }
    ],
    "params"
  ),
  deleteOne
);

router.post(
  "/request-budget",
  logger({
    name: "request budget",
    description: "request budget",
    module
  }),
  validateParams(
    [
      {
        param_key: "movement",
        required: true,
        type: "string",
        validator_functions: []
      },
      {
        param_key: "lines",
        required: true,
        type: "array",
        validator_functions: []
      },
      {
        param_key: "contact",
        required: true,
        type: "string",
        validator_functions: []
      }
    ],
    "body"
  ),
  requestBudget
);

export default router;
