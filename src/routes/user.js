import { Router } from "express";
import multer from "multer";
const upload = multer();
const router = Router();
import { validateParams } from "../middleware/validate";
import {
    create,
    get,
    logout,
    find,
    getOne,
    password,
    update,
    business,
    scope,
    user,
    restart,
    relationsFind,
    lastItems,
    lastParents,
    connections,
    profilePhoto
} from "../controllers/user";

router.post("/", create);

/*
{
	get--/ 
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
router.put("/profile/photo", upload.single("photo"), profilePhoto);
router.put(
    "/password",
    validateParams(
        [
            {
                param_key: "password",
                required: false,
                type: "string"
            },
            {
                param_key: "newPassword",
                required: true,
                type: "string"
            }
        ],
        "body"
    ),
    password
);

router.get("/", get);
router.get("/lastItems", lastItems);
router.get("/lastParents", lastParents);
router.get("/logout", logout);
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
    "/relations/:q",
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
    relationsFind
);
router.get(
    "/:id",
    validateParams(
        [
            {
                param_key: "id",
                required: true,
                type: "string"
            }
        ],
        "params"
    ),
    getOne
);
router.post(
    "/restart/:q",
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
    restart
);
router.put(
    "/business/:id",
    validateParams(
        [
            {
                param_key: "id",
                required: true,
                type: "string"
            }
        ],
        "params"
    ),
    validateParams(
        [
            {
                param_key: "business",
                required: true,
                type: "string"
            }
        ],
        "body"
    ),
    business
);
router.put(
    "/user/:id",
    validateParams(
        [
            {
                param_key: "id",
                required: true,
                type: "string"
            }
        ],
        "params"
    ),
    validateParams(
        [
            {
                param_key: "user",
                required: true,
                type: "string"
            }
        ],
        "body"
    ),
    user
);
router.put(
    "/scope/:id",
    validateParams(
        [
            {
                param_key: "id",
                required: true,
                type: "string"
            }
        ],
        "params"
    ),
    validateParams(
        [
            {
                param_key: "type",
                required: true,
                type: "string"
            },
            {
                param_key: "id",
                required: true,
                type: "string"
            }
        ],
        "body"
    ),
    scope
);
router.put(
    "/:id",
    validateParams(
        [
            {
                param_key: "id",
                required: true,
                type: "string"
            }
        ],
        "params"
    ),
    validateParams(
        [
            {
                param_key: "name",
                required: false,
                type: "object"
            }
        ],
        "body"
    ),
    update
);

router.get("/connections", connections);
export default router;
