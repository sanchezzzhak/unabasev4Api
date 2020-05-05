import { create, deleteOne, getFrom, updateOne } from "../controllers/comment";
import { Router } from "express";
const router = Router();
let module = "comment";

router.post("/", create);
router.delete("/:id", deleteOne);
router.get("/:id/:name", getFrom);
router.put("/:id", updateOne);

export default router;
