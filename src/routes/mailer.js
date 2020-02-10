import { Router } from "express";

import { sendMail } from "../controllers/mailer";
const router = Router();
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
router.post("/", sendMail);

export default router;
