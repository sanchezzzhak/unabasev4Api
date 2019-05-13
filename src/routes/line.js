import { Router } from "express";
const lines = Router();
import { create, get, updateOne, deleteOne, createMany, updateMany, deleteMany } from "../controllers/line";

import auth from "../config/lib/auth";
import logger from "../lib/logger";

lines.use(auth.sToken);

let module = "line";

lines.get(
  "/",
  logger({
    name: "list lines",
    description: "get the list of lines",
    module
  }),
  get
);
lines.post(
  "/",
  logger({
    name: "create line",
    description: "create line",
    module
  }),
  create
);
lines.post(
  "/many",
  logger({
    name: "create line",
    description: "create line",
    module
  }),
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
  logger({
    name: "updateOne lines",
    description: "updateOne line",
    module
  }),
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

export default lines;
