import { Router } from 'express';
const users = Router();
import ctl from '../controllers/user';
import {
  create,
  get,
  logout,
  findOne,
  getOne,
  password,
  update
} from '../controllers/user';

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
users.post('/', create);
users.get('/', get);
users.get('/logout', logout);
users.get('/find', findOne);
users.get('/:id', getOne);
users.put('/password/:id', password);
users.put('/:id', update);

export default users;
