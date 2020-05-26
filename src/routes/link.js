import { Router } from "express";
import { isAuth } from "../config/lib/auth";
import { validateParams } from "../middleware/validate";
import { find, create, addMember, deleteOne, get, getOne, updateOne, removeMember, getByMember, getByUser, setMain, getRelated, getOneByUrl } from "../controllers/link";

const router = Router();

router.get("/", get);

router.get(
  "/related",

  getRelated
);



router.get("/url",  getOneByUrl );


router.get(
  "/find/:q",
  validateParams(
    [
      {
        param_key: "q",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  find
);
router.get(
  "/:id",
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  getOne
);




router.get(
  "/member/:member",
  validateParams(
    [
      {
        param_key: "member",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  getByMember
);

router.get(
  "/user/:user",
  validateParams(
    [
      {
        param_key: "user",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  getByUser
);
router.post(
  "/",
  validateParams(
    [
      {
        param_key: "url",
        required: true,
        type: "string"
      },
      {
        param_key: "type",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  create
);
router.put(
  "/main",
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "objectid"
      },
      {
        param_key: "main",
        required: true,
        type: "boolean"
      }
    ],
    "body"
  ),
  setMain
);
router.put(
  "/:id",
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  updateOne
);

router.put(
  "/member/add/:id",
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  addMember
);
router.put(
  "/member/remove/:id",
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  validateParams(
    [
      {
        param_key: "user",
        required: true,
        type: "objectid"
      }
    ],
    "body"
  ),
  removeMember
);
router.delete(
  "/:id",
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  deleteOne
);

export default router;
