import { Router } from "express";
const taxs = Router();
import { get, getOne, create, updateOne, find, deleteOne } from "../controllers/tax";
import { sToken } from "../config/lib/auth";
import { isAuth } from "../config/lib/auth";

taxs.use(sToken);

taxs.get("/", get);
// taxs.get('/', filter)
taxs.get("/:id", getOne);
taxs.post("/", create);
taxs.put("/:id", updateOne);
taxs.get("/find/:q", find);
taxs.delete("/:id", deleteOne);

export default taxs;
