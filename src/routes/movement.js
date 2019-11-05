import { Router } from "express";
const movements = Router();
import { get, getPersonal, getBusiness, create, getOne, findOne, find, updateOne, getRelated, byItem } from "../controllers/movement";
import auth from "../config/lib/auth";
import logger from "../lib/logger";
let module = "movement";
// if (process.env.NODE_ENV !== 'test') {
movements.get(
  "/:id",
  logger({
    name: "get one movement by id",
    description: "get one movement by id",
    module
  }),
  getOne
);

movements.use(auth.sToken);
// }

movements.get(
  "/",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  get
);
movements.get(
  "/related/:id",
  logger({
    name: "list movements with related contact",
    description: "get the list of movements with related contact",
    module
  }),
  getRelated
);
movements.get(
  "/personal/:state",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  getPersonal
);
movements.get(
  "/business/:state/:id",
  logger({
    name: "list movements",
    description: "get the list of movements",
    module
  }),
  getBusiness
);
// movements.get(
//   '/business/:state',
//   logger({
//     name: 'list movements',
//     description: 'get the list of movements',
//     module
//   }),
//   get
// );
// movements.get('/', filter)
movements.get(
  "/findOne",
  logger({
    name: "create movement",
    description: "create movement",
    module
  }),
  findOne
);
movements.get(
  "/find/:q",
  logger({
    name: "create movement",
    description: "create movement",
    module
  }),
  find
);
movements.get(
  "/item/:id",
  logger({
    name: "find movements by item",
    description: "find movements by item",
    module
  }),
  byItem
);

movements.post(
  "/",
  logger({
    name: "create movement",
    description: "create movement",
    module
  }),
  create
);
movements.put("/:id", updateOne);

export default movements;
