import { Router } from 'express';
const users = Router();
import ctl from './controller';

import auth from '../../config/lib/auth';
users.use(auth.sToken);

/*
{
	get--/ 
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.post('/', ctl.postUsers);
users.get('/', ctl.get);
users.get('/logout', ctl.logout);
users.get('/find', ctl.findOne);
users.get('/:id', ctl.getUser);
// users.post('/', ctl.createUser)
users.put('/', ctl.updateUser);

export default users;
