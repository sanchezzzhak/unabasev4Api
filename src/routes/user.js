import { Router } from 'express';
const users = Router();
import ctl from '../controllers/user';

import auth from '../config/lib/auth';
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
users.put('/password/:id', ctl.password);
// users.post('/', ctl.createUser)
users.put('/', ctl.updateUser);

export default users;
