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
  createRequest
} from "../controllers/movement";
import { sToken } from "../config/lib/auth";
import logger from "../lib/logger";
import { checkPermission } from "../middleware/permission";
let module = "movement";
// if (process.env.NODE_ENV !== 'test') {

router.use(sToken);

router.get(
  "/:id",
  logger({
    name: "get one movement by id",
    description: "get one movement by id",
    module
  }),
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
  getRelated
);
router.get(
  "/personal/:state",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  getPersonal
);
router.get(
  "/business/:state/:id",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
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
  find
);
router.get(
  "/item/:id",
  logger({
    name: "find movements by item",
    description: "find movements by item",
    module
  }),
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
  create
);
router.put("/:id", updateOne);
router.post("/expense", createExpense);
router.post("request", createRequest);

router.get("/line/client/:id", getByClientLine);

export default router;
