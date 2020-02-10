import { create, deleteOne, getFrom, updateOne } from "../controllers/comment";
import { Router } from "express";
const comment = Router();
let module = "comment";

import { sToken } from "../config/lib/auth";
comment.use(sToken);
comment.post("/", create);
comment.delete("/:id", deleteOne);
comment.get("/:id/:name", getFrom);
comment.put("/:id", updateOne);

export default comment;
