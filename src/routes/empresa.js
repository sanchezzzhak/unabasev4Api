import { Router } from "express";

const router = Router();

import { get, getOne } from "../controllers/empresa";
import { isAuth } from "../config/lib/auth";
import logger from "../lib/logger";

let module = "siiBusiness";

router.get(
  "/:q",
  logger({
    name: "get one sii businesss",
    description: "get one sii business",
    module
  }),
  getOne
);

router.get(
  "/",
  logger({
    name: "find sii businesss",
    description: "find sii business",
    module
  }),
  get
);

export default router;
