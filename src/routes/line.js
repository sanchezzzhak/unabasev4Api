import { Router } from "express";
const lines = Router();
import { create, get, updateOne, deleteOne, createMany, updateMany, deleteMany, group, move, createParent, getLinesByMovement, requestBudget } from "../controllers/line";
import { checkItem, updateMovementState, updateTotalMovement, updateItemLastPrice, checkParent, updateOldParent, getCurrencyFromMovement } from "../middleware/line";

import { sToken } from "../config/lib/auth";
import logger from "../lib/logger";

lines.use(sToken);

let module = "line";

lines.get("/", logger({ name: "list lines", description: "get the list of lines", module }), get);
lines.get("/movement/:movement", logger({ name: "get lines by movement", description: "get the list of lines", module }), getLinesByMovement);
lines.post(
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
  create
);
lines.post(
  "/parent",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    updateMovementState
  ],
  createParent
);
lines.put(
  "/move",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    updateOldParent
  ],
  move
);
lines.post(
  "/group",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    checkItem
  ],
  group
);
lines.post(
  "/many",
  [
    logger({
      name: "create line",
      description: "create line",
      module
    }),
    updateMovementState,
    checkParent,
    getCurrencyFromMovement
  ],
  createMany
);
lines.put(
  "/many",
  logger({
    name: "create line",
    description: "create line",
    module
  }),
  updateMany
);
lines.delete(
  "/many",
  logger({
    name: "create line",
    description: "create line",
    module
  }),
  deleteMany
);
lines.put(
  "/:id",
  [
    logger({
      name: "updateOne lines",
      description: "updateOne line",
      module
    }),
    updateTotalMovement,
    updateItemLastPrice,
    checkParent
  ],
  updateOne
);
lines.delete(
  "/:id",
  logger({
    name: "delete one line",
    description: "delete one line",
    module
  }),
  deleteOne
);

lines.post(
  "/request-budget",
  logger({
    name: "request budget",
    description: "request budget",
    module
  }),
  requestBudget
);

export default lines;
