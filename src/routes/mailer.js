import { Router } from 'express';

import { send } from '../controllers/mailer';
const mailer = Router();
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
mailer.post('/', send);

export default mailer;
