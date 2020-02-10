import { Router } from "express";
const contacts = Router();
import { get, getOne, find, updateOne, create, findSelf, byItem } from "../controllers/contact";

import { sToken } from "../config/lib/auth";
contacts.use(sToken);

contacts.post("/", create);
contacts.get("/", get);
contacts.get("/self/:q", findSelf);
contacts.get("/self", findSelf);
contacts.get("/find/:q", find);
contacts.get("/:id", getOne);
contacts.put("/:id", updateOne);
contacts.get("/item/:id", byItem);

export default contacts;
